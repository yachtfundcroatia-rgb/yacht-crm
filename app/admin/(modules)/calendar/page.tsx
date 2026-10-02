"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

type LeadEvent = {
  id: string;
  lead_id: string;
  type: string;
  title: string;
  notes: string | null;
  scheduled_at: string;
  completed_at: string | null;
  created_at: string;
  leads?: { id: string; full_name: string; email: string };
  admins?: { id: string; full_name: string };
};

type Filter = "upcoming" | "overdue" | "completed" | "all";

const TYPE_LABELS: Record<string, string> = {
  call: "📞 Call",
  email: "✉️ Email",
  meeting: "🤝 Meeting",
  follow_up: "🔄 Follow-up",
  other: "📌 Other",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((eventDay.getTime() - today.getTime()) / 86400000);

  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const dateStr = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Tomorrow, ${time}`;
  if (diff === -1) return `Yesterday, ${time}`;
  return `${dateStr}, ${time}`;
}

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function loadEvents(f: Filter = filter) {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/events?filter=${f}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(data.events || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadEvents(); }, [filter]);

  async function complete(id: string) {
    await fetch(`${API}/api/admin/events/${id}/complete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadEvents();
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`${API}/api/admin/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadEvents();
  }

  const isOverdue = (e: LeadEvent) => !e.completed_at && new Date(e.scheduled_at) < new Date();

  const filterButtons: { key: Filter; label: string; icon: React.ReactNode }[] = [
    { key: "upcoming", label: "Upcoming", icon: <Clock className="w-4 h-4" /> },
    { key: "overdue", label: "Overdue", icon: <AlertCircle className="w-4 h-4" /> },
    { key: "completed", label: "Completed", icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: "all", label: "All", icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#0a192f]">Calendar</h2>
          <p className="text-gray-500 text-sm mt-0.5">Scheduled tasks & follow-ups</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === btn.key
                ? "bg-[#137fec] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#137fec] hover:text-[#137fec]"
            }`}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">No events found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map((e) => (
              <div
                key={e.id}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  isOverdue(e) ? "bg-red-50/40" : ""
                } ${e.completed_at ? "opacity-60" : ""}`}
              >
                {/* Status icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {e.completed_at ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isOverdue(e) ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-[#137fec]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {TYPE_LABELS[e.type] || e.type}
                      </span>
                      <p className="font-bold text-[#0a192f] text-sm mt-0.5">{e.title}</p>
                      {e.notes && (
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{e.notes}</p>
                      )}
                      {e.leads && (
                        <button
                          onClick={() => router.push(`/admin/leads/${e.leads!.id}`)}
                          className="flex items-center gap-1 mt-2 text-xs text-[#137fec] font-semibold hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {e.leads.full_name} · {e.leads.email}
                        </button>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className={`text-xs font-semibold ${isOverdue(e) ? "text-red-500" : "text-gray-500"}`}>
                        {formatDate(e.scheduled_at)}
                      </p>
                      {e.admins && (
                        <p className="text-xs text-gray-400 mt-0.5">{e.admins.full_name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!e.completed_at && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => complete(e.id)}
                      title="Mark as done"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent(e.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
