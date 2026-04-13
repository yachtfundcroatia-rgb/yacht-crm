"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "@/app/context/AdminContext";
import { ArrowLeft, UserCheck, Calendar, Phone, Mail, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: string;
  created_at: string;
  assigned_admin_id?: string | null;
  notes?: string | null;
  investment_amount?: number | null;
  preferred_call_time?: string | null;
  lead_type?: string | null;
}

interface Reservation {
  deposit_amount: number;
  remaining_amount: number;
  status: string;
  deposit_paid_at?: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  contacted: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  call_scheduled: "bg-purple-50 text-purple-700 border border-purple-200",
  call_done: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  interested: "bg-green-50 text-green-700 border border-green-200",
  waiting_for_transfer: "bg-orange-50 text-orange-700 border border-orange-200",
  converted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  lost: "bg-red-50 text-red-600 border border-red-200",
};

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { admin, token } = useAdmin();
  const leadId = params.lead_id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [allowedTransitions, setAllowedTransitions] = useState<string[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState("20000");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteMsg, setNoteMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function fetchLead() {
    if (!token) return router.replace("/login");
    const res = await fetch(`${API_URL}/api/admin/leads/${leadId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLead(data.lead);
    setAllowedTransitions(data.allowedTransitions || []);
    setReservation(data.reservation || null);
    setLoading(false);
  }

  async function fetchAdmins() {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/admins`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setAdmins(data);
  }

  useEffect(() => {
    fetchLead();
    if (admin?.role === "superadmin") fetchAdmins();
  }, [leadId, token]);

  async function handleTransition(status: string) {
    setUpdating(true);
    await fetch(`${API_URL}/api/admin/leads/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ lead_id: leadId, status }),
    });
    await fetchLead();
    setUpdating(false);
  }

  async function saveNote() {
    if (!note.trim()) return;
    setSavingNote(true);
    setNoteMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/leads/add-note`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lead_id: leadId, note }),
      });
      if (res.ok) {
        setNoteMsg("Note saved");
        setNote("");
        await fetchLead();
      } else {
        const d = await res.json();
        setNoteMsg(d.error || "Failed to save note");
      }
    } catch { setNoteMsg("Error saving note"); }
    finally { setSavingNote(false); }
  }

  async function createReservation() {
    try {
      setCreating(true);
      const amount = Number(investmentAmount);
      const deposit = amount * 0.1;
      const remaining = amount * 0.9;
      const res = await fetch(`${API_URL}/api/admin/reservations/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          lead_id: leadId,
          investment_ref: "TEST_YACHT_01",
          deposit_amount: deposit,
          remaining_amount: remaining,
          slots_reserved: amount / 10000,
        }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      await handleTransition("waiting_for_transfer");
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setCreating(false); }
  }

  async function confirmDeposit() {
    try {
      setProcessing(true);
      const res = await fetch(`${API_URL}/api/admin/reservations/mark-deposit-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lead_id: leadId }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      await fetchLead();
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setProcessing(false); }
  }

  async function convertToInvestor() {
    try {
      setProcessing(true);
      const res = await fetch(`${API_URL}/api/admin/leads/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lead_id: leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ text: `Investor created. Temp password: ${data.temporary_password}`, ok: true });
      await fetchLead();
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setProcessing(false); }
  }

  async function assignLead() {
    if (!selectedAdmin) return;
    try {
      setAssigning(true);
      const res = await fetch(`${API_URL}/api/admin/leads/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lead_id: leadId, new_admin_id: selectedAdmin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchLead();
      setSelectedAdmin("");
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setAssigning(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!lead) return <div className="text-gray-500 p-8">Lead not found</div>;

  const currentAdmin = admins.find((a) => a.id === lead.assigned_admin_id);

  return (
    <div className="max-w-4xl">
      {/* Back */}
      <button onClick={() => router.push("/admin/leads")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#137fec] transition-colors mb-6 font-semibold">
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </button>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm font-semibold ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
          {message.text}
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0a192f] mb-1">{lead.full_name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              {lead.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{lead.email}</span>}
              {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{lead.phone}</span>}
              {lead.investment_amount && <span className="flex items-center gap-1 font-semibold text-[#0a192f]">€{Number(lead.investment_amount).toLocaleString()}</span>}
            </div>
            {lead.lead_type && (
              <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{lead.lead_type}</span>
            )}
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600"}`}>
            {lead.status}
          </span>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="mt-4 p-3 bg-[#f8faff] rounded-xl border border-blue-50">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Notes</div>
            <p className="text-sm text-gray-700 leading-relaxed">{lead.notes}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Add Note */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-[#0a192f] mb-4">Add Note</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add a note about this lead..."
            className={`${inputClass} resize-none mb-3`}
          />
          {noteMsg && (
            <p className={`text-xs font-semibold mb-2 ${noteMsg === "Note saved" ? "text-green-600" : "text-red-500"}`}>{noteMsg}</p>
          )}
          <button
            onClick={saveNote}
            disabled={savingNote || !note.trim()}
            className="px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-40"
          >
            {savingNote ? "Saving..." : "Save Note"}
          </button>
        </div>

        {/* Status Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-[#0a192f] mb-4">Status Actions</h2>
          {allowedTransitions.length === 0 ? (
            <p className="text-sm text-gray-400">No available transitions</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allowedTransitions.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTransition(t)}
                  disabled={updating}
                  className="px-4 py-2 bg-[#f8faff] border border-blue-100 text-[#137fec] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors disabled:opacity-40"
                >
                  {t.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Assign — superadmin only */}
        {admin?.role === "superadmin" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-[#0a192f] mb-4">Assign to Admin</h2>
            {currentAdmin && (
              <p className="text-sm text-gray-500 mb-3">
                Currently: <span className="font-bold text-[#0a192f]">{currentAdmin.email}</span>
              </p>
            )}
            <div className="flex gap-2">
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className={`${inputClass} flex-1`}
              >
                <option value="">— select admin —</option>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>{a.email} ({a.role})</option>
                ))}
              </select>
              <button
                onClick={assignLead}
                disabled={assigning || !selectedAdmin}
                className="px-4 py-2 bg-[#137fec] text-white rounded-xl text-sm font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-40"
              >
                {assigning ? "..." : "Assign"}
              </button>
            </div>
          </div>
        )}

        {/* Reservation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-[#0a192f] mb-4">Reservation</h2>

          {!reservation && (
            <div>
              <label className={labelClass}>Investment Amount (€)</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className={`${inputClass} mb-3`}
              />
              <button
                onClick={createReservation}
                disabled={creating}
                className="px-4 py-2 bg-[#137fec] text-white rounded-xl text-sm font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-40"
              >
                {creating ? "Creating..." : "Create Reservation"}
              </button>
            </div>
          )}

          {reservation && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f8faff] rounded-xl p-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Deposit</div>
                  <div className="font-black text-[#0a192f]">€{Number(reservation.deposit_amount).toLocaleString()}</div>
                </div>
                <div className="bg-[#f8faff] rounded-xl p-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Remaining</div>
                  <div className="font-black text-[#0a192f]">€{Number(reservation.remaining_amount).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[reservation.status] || "bg-gray-100 text-gray-600"}`}>
                  {reservation.status}
                </span>
                <span className={`text-xs font-bold ${reservation.deposit_paid_at ? "text-green-600" : "text-orange-500"}`}>
                  Deposit: {reservation.deposit_paid_at ? "PAID" : "PENDING"}
                </span>
              </div>
              {!reservation.deposit_paid_at && (
                <button onClick={confirmDeposit} disabled={processing} className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-40">
                  {processing ? "Processing..." : "Confirm Deposit Paid"}
                </button>
              )}
              {reservation.deposit_paid_at && (
                <button onClick={convertToInvestor} disabled={processing} className="w-full py-2.5 bg-[#0a192f] text-white rounded-xl text-sm font-bold hover:bg-[#0f2848] transition-colors disabled:opacity-40">
                  {processing ? "Processing..." : "Convert to Investor"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
