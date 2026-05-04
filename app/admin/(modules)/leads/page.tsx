"use client";

import { useRouter } from "next/navigation";
import { useLeads } from "./hooks/useLeads";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Mail, Send } from "lucide-react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  contacted: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  call_scheduled: "bg-purple-50 text-purple-700 border border-purple-200",
  call_done: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  interested: "bg-green-50 text-green-700 border border-green-200",
  converted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  lost: "bg-red-50 text-red-600 border border-red-200",
};

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  investment_amount: "",
  lead_type: "manual",
  preferred_call_time: "",
  notes: "",
};

const EMPTY_EMAIL = {
  subject: "",
  html: "",
};

export default function LeadsPage() {
  const router = useRouter();
  const { token } = useAdmin();
  const [page, setPage] = useState(1);
  const { leads, loading, error, pagination, fetchLeads } = useLeads({ page });

  // Add lead form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  // Email blast
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [emailForm, setEmailForm] = useState(EMPTY_EMAIL);
  const [sendTarget, setSendTarget] = useState<"all" | "selected">("all");
  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      setMessage({ text: "Name and email are required", ok: false });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          investment_amount: form.investment_amount ? Number(form.investment_amount) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lead");
      setMessage({ text: "Lead created successfully", ok: true });
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchLeads();
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setSaving(false); }
  }

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectedIds(new Set(leads.map((l: any) => l.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function openEmailModal(target: "all" | "selected") {
    setSendTarget(target);
    setEmailForm(EMPTY_EMAIL);
    setEmailResult(null);
    setShowEmailModal(true);
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!emailForm.subject || !emailForm.html) {
      setEmailResult({ text: "Subject and message are required", ok: false });
      return;
    }
    setSending(true);
    setEmailResult(null);
    try {
      const body: any = {
        subject: emailForm.subject,
        html: emailForm.html.replace(/\n/g, "<br>"),
      };
      if (sendTarget === "selected") {
        body.lead_ids = Array.from(selectedIds);
      }
      const res = await fetch(`${API_URL}/api/admin/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setEmailResult({ text: `✓ Sent to ${data.sent} recipient${data.sent !== 1 ? "s" : ""}`, ok: true });
      setEmailForm(EMPTY_EMAIL);
    } catch (err: any) {
      setEmailResult({ text: err.message, ok: false });
    } finally { setSending(false); }
  }

  const allSelected = leads.length > 0 && leads.every((l: any) => selectedIds.has(l.id));

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0a192f] mb-1">Leads</h1>
          <p className="text-gray-500 text-sm">{pagination.total} total leads</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={() => openEmailModal("selected")}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0a192f] text-white rounded-xl font-bold text-sm hover:bg-[#0f2848] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email selected ({selectedIds.size})
            </button>
          )}
          <button
            onClick={() => openEmailModal("all")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            <Send className="w-4 h-4" />
            Email all
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setMessage(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Lead"}
          </button>
        </div>
      </div>

      {/* Add Lead Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-black text-[#0a192f] mb-5">New Lead</h2>
          <form onSubmit={handleAddLead}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Investment Amount (€)</label>
                <input type="number" value={form.investment_amount} onChange={(e) => setForm({ ...form, investment_amount: e.target.value })} className={inputClass} placeholder="e.g. 10000" />
              </div>
              <div>
                <label className={labelClass}>Lead Type</label>
                <select value={form.lead_type} onChange={(e) => setForm({ ...form, lead_type: e.target.value })} className={inputClass}>
                  <option value="manual">Manual (CRM)</option>
                  <option value="invest_now">Invest Now</option>
                  <option value="book_a_call">Book a Call</option>
                  <option value="contact">Contact Form</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Preferred Call Time</label>
                <select value={form.preferred_call_time} onChange={(e) => setForm({ ...form, preferred_call_time: e.target.value })} className={inputClass}>
                  <option value="">—</option>
                  <option value="morning">Morning (9:00 - 12:00)</option>
                  <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                  <option value="evening">Evening (17:00 - 20:00)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Initial notes about this lead..." className={`${inputClass} resize-none`} />
              </div>
            </div>
            {message && (
              <div className={`px-4 py-3 rounded-xl text-sm font-semibold mt-4 ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                {message.text}
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors disabled:opacity-50">
                {saving ? "Creating..." : "Create Lead"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setMessage(null); }} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm">{error}</div>}

      {!loading && !error && leads.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">No leads found.</div>
      )}

      {!loading && !error && leads.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#137fec] focus:ring-[#137fec] cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  className={`border-b border-gray-50 hover:bg-[#f8faff] transition-colors cursor-pointer ${selectedIds.has(lead.id) ? "bg-blue-50/40" : ""}`}
                >
                  <td className="px-4 py-4" onClick={(e) => toggleSelect(lead.id, e)}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-gray-300 text-[#137fec] focus:ring-[#137fec] cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#0a192f]">{lead.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(lead.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pagination.page === 1}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />Previous
            </button>
            <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              Next<ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Email Blast Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative">
            <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-3xl font-light leading-none">×</button>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#137fec]" />
                </div>
                <h3 className="text-xl font-black text-[#0a192f]">Send Email</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6 ml-13">
                {sendTarget === "all"
                  ? `To all ${pagination.total} leads`
                  : `To ${selectedIds.size} selected lead${selectedIds.size !== 1 ? "s" : ""}`}
              </p>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className={labelClass}>Subject</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. New investment opportunity at Yacht Fund"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    value={emailForm.html}
                    onChange={(e) => setEmailForm({ ...emailForm, html: e.target.value })}
                    rows={8}
                    placeholder={"Dear {{name}},\n\nYour message here...\n\nBest regards,\nYacht Fund Team"}
                    className={`${inputClass} resize-none font-mono text-xs`}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Tip: <code className="bg-gray-100 px-1 rounded">{"{{name}}"}</code> zostanie zastąpione imieniem i nazwiskiem odbiorcy z bazy. Np. wpisz <em>Dear {"{{name}}"},</em> a każdy otrzyma <em>Dear Jack Smith,</em>
                  </p>
                </div>

                {emailResult && (
                  <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${emailResult.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                    {emailResult.text}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? "Sending..." : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}