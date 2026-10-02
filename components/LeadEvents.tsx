"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  X,
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
};

const TYPE_OPTIONS = [
  { value: "call", label: "📞 Call" },
  { value: "email", label: "✉️ Email" },
  { value: "meeting", label: "🤝 Meeting" },
  { value: "follow_up", label: "🔄 Follow-up" },
  { value: "other", label: "📌 Other" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((eventDay.getTime() - today.getTime()) / 86400000);
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const dateStr = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  if (diff === 0) return `Today ${time}`;
  if (diff === 1) return `Tomorrow ${time}`;
  if (diff === -1) return `Yesterday ${time}`;
  return `${dateStr} ${time}`;
}

export default function LeadEvents({ leadId }: { leadId: string }) {
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    type: "call",
    title: "",
    notes: "",
    scheduled_at: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function load() {
    try {
      const res = await fetch(`${API}/api/admin/events?lead_id=${leadId}&filter=all&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(data.events || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [leadId]);

  async function save() {
    if (!form.title || !form.scheduled_at) return;
    setSaving(true);
    try {
      await fetch(`${API}/api/admin/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, lead_id: leadId }),
      });
      setShowModal(false);
      setForm({ type: "call", title: "", notes: "", scheduled_at: "" });
      load();
    } catch {}
    setSaving(false);
  }

  async function complete(id: string) {
    await fetch(`${API}/api/admin/events/${id}/complete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`${API}/api/admin/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  }

  const pending = events.filter((e) => !e.completed_at);
  const done = events.filter((e) => e.completed_at);
  const isOverdue = (e: LeadEvent) => !e.completed_at && new Date(e.scheduled_at) < new Date();

  // Default datetime: tomorrow 10:00
  function defaultDatetime() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#137fec]" />
          <span className="font-bold text-[#0a192f] text-sm">Events & Tasks</span>
          {pending.length > 0 && (
            <span className="bg-[#137fec] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </div>
        <button
          onClick={() => { setForm({ ...form, scheduled_at: defaultDatetime() }); setShowModal(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#137fec] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      <div className="p-4 space-y-2">
        {loading ? (
          <p className="text-gray-400 text-xs text-center py-4">Loading...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-xs">No events yet</p>
          </div>
        ) : (
          <>
            {pending.map((e) => (
              <div
                key={e.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isOverdue(e) ? "border-red-200 bg-red-50/50" : "border-gray-100 bg-gray-50"
                }`}
              >
                {isOverdue(e) ? (
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-[#137fec] mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0a192f]">{e.title}</p>
                  <p className={`text-[11px] font-semibold mt-0.5 ${isOverdue(e) ? "text-red-500" : "text-gray-400"}`}>
                    {formatDate(e.scheduled_at)} · {TYPE_OPTIONS.find((t) => t.value === e.type)?.label || e.type}
                  </p>
                  {e.notes && <p className="text-[11px] text-gray-500 mt-1">{e.notes}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => complete(e.id)} title="Done" className="p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(e.id)} title="Delete" className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {done.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 font-semibold select-none">
                  {done.length} completed
                </summary>
                <div className="mt-2 space-y-1.5">
                  {done.map((e) => (
                    <div key={e.id} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/40 border border-green-100 opacity-60">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0a192f] line-through">{e.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(e.scheduled_at)}</p>
                      </div>
                      <button onClick={() => remove(e.id)} className="p-1 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>

      {/* Add event modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-black text-[#0a192f]">Add Event</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#137fec]"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Follow-up call"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#137fec]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#137fec]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#137fec] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.title || !form.scheduled_at}
                className="flex-1 py-2.5 rounded-xl bg-[#137fec] text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
