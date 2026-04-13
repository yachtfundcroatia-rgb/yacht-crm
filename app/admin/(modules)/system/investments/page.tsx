"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/app/context/AdminContext";
import { TrendingUp, Pencil, Plus, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Investment {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url: string;
  target_roi: number;
  min_investment: number;
  total_slots: number;
  available_slots: number;
  vessel_year: number;
  vessel_length: string;
  vessel_cabins: number;
  status: string;
  currency: string;
  display_order: number;
}

const EMPTY_FORM = {
  id: "", name: "", description: "", location: "", image_url: "",
  target_roi: "", min_investment: "10000", total_slots: "", available_slots: "",
  vessel_year: "", vessel_length: "", vessel_cabins: "",
  status: "fundraising", currency: "EUR", display_order: "0",
};

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

const STATUS_STYLES: Record<string, string> = {
  fundraising: "bg-green-50 text-green-700 border border-green-200",
  active: "bg-blue-50 text-blue-700 border border-blue-200",
  upcoming: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  coming_soon: "bg-gray-100 text-gray-600 border border-gray-200",
  closed: "bg-red-50 text-red-600 border border-red-200",
};

export default function InvestmentsAdminPage() {
  const { token } = useAdmin();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({});
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null);

  async function fetchInvestments() {
    try {
      const res = await fetch(`${API_URL}/api/admin/investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setInvestments(data);
        const s: Record<string, string> = {};
        data.forEach((inv: Investment) => { s[inv.id] = inv.status; });
        setStatusUpdates(s);
      }
    } catch {}
    finally { setLoading(false); }
  }

  useEffect(() => { if (token) fetchInvestments(); }, [token]);

  function openCreate() { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setMessage(null); }
  function openEdit(inv: Investment) {
    setForm({
      id: inv.id, name: inv.name || "", description: inv.description || "",
      location: inv.location || "", image_url: inv.image_url || "",
      target_roi: inv.target_roi?.toString() || "", min_investment: inv.min_investment?.toString() || "10000",
      total_slots: inv.total_slots?.toString() || "", available_slots: inv.available_slots?.toString() || "",
      vessel_year: inv.vessel_year?.toString() || "", vessel_length: inv.vessel_length || "",
      vessel_cabins: inv.vessel_cabins?.toString() || "", status: inv.status || "fundraising",
      currency: inv.currency || "EUR", display_order: inv.display_order?.toString() || "0",
    });
    setEditingId(inv.id); setShowForm(true); setMessage(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage(null);
    try {
      const payload = {
        ...form,
        target_roi: Number(form.target_roi), min_investment: Number(form.min_investment),
        total_slots: Number(form.total_slots), available_slots: Number(form.available_slots),
        vessel_year: Number(form.vessel_year), vessel_cabins: Number(form.vessel_cabins),
        display_order: Number(form.display_order),
      };
      const url = editingId ? `${API_URL}/api/admin/investments/${editingId}` : `${API_URL}/api/admin/investments`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) setMessage({ text: data.error, ok: false });
      else { setMessage({ text: editingId ? "Investment updated" : "Investment created", ok: true }); setShowForm(false); fetchInvestments(); }
    } catch { setMessage({ text: "Server error", ok: false }); }
    finally { setSaving(false); }
  }

  async function handleStatusUpdate(invId: string) {
    const newStatus = statusUpdates[invId];
    if (!newStatus) return;
    setUpdatingStatus(invId);
    setStatusMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/investments/${invId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatusMsg({ id: invId, text: "Status updated", ok: true });
      fetchInvestments();
    } catch (err: any) {
      setStatusMsg({ id: invId, text: err.message, ok: false });
    } finally { setUpdatingStatus(null); }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0a192f] mb-1">Investment Management</h1>
          <p className="text-gray-500 text-sm">{investments.length} investments</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors">
          <Plus className="w-4 h-4" />Add Investment
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-semibold mb-4 ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
          {message.text}
        </div>
      )}

      {/* Investment list with inline status change */}
      {!loading && investments.length > 0 && (
        <div className="space-y-4 mb-6">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                {inv.image_url && (
                  <img src={inv.image_url} alt={inv.name} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black text-[#0a192f]">{inv.name}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[inv.status] || "bg-gray-100 text-gray-600"}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {inv.location} · ROI: {inv.target_roi}% · Slots: {inv.available_slots}/{inv.total_slots} · Min: {inv.currency} {Number(inv.min_investment).toLocaleString()}
                  </div>
                </div>
                <button onClick={() => openEdit(inv)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex-shrink-0">
                  <Pencil className="w-3 h-3" />Edit
                </button>
              </div>

              {/* Inline status change */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-[#137fec] flex-shrink-0" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex-shrink-0">Change Status:</span>
                <select
                  value={statusUpdates[inv.id] || inv.status}
                  onChange={(e) => setStatusUpdates({ ...statusUpdates, [inv.id]: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#137fec] bg-white"
                >
                  <option value="fundraising">Fundraising</option>
                  <option value="active">Active (enables profit distribution)</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  onClick={() => handleStatusUpdate(inv.id)}
                  disabled={updatingStatus === inv.id || statusUpdates[inv.id] === inv.status}
                  className="px-4 py-1.5 bg-[#137fec] text-white rounded-lg text-xs font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  {updatingStatus === inv.id ? "..." : "Update"}
                </button>
                {statusMsg?.id === inv.id && (
                  <span className={`text-xs font-semibold ${statusMsg.ok ? "text-green-600" : "text-red-500"}`}>{statusMsg.text}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[#0a192f]">{editingId ? "Edit Investment" : "New Investment"}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Investment ID *</label>
                <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={!!editingId} placeholder="e.g. LAGOON_42_2024" required
                  className={`${inputClass} ${editingId ? "bg-gray-50 text-gray-400" : ""}`} />
                {!editingId && <p className="text-xs text-gray-400 mt-1">Cannot be changed after creation</p>}
              </div>
              <div>
                <label className={labelClass}>Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Location *</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} />
                {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-16 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              </div>
              <div>
                <label className={labelClass}>Target ROI (%)</label>
                <input type="number" step="0.1" value={form.target_roi} onChange={(e) => setForm({ ...form, target_roi: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Min Investment ({form.currency})</label>
                <input type="number" value={form.min_investment} onChange={(e) => setForm({ ...form, min_investment: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Total Slots</label>
                <input type="number" value={form.total_slots} onChange={(e) => setForm({ ...form, total_slots: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Available Slots</label>
                <input type="number" value={form.available_slots} onChange={(e) => setForm({ ...form, available_slots: e.target.value })} className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Display only — no financial impact</p>
              </div>
              <div>
                <label className={labelClass}>Vessel Year</label>
                <input type="number" value={form.vessel_year} onChange={(e) => setForm({ ...form, vessel_year: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Vessel Length</label>
                <input value={form.vessel_length} onChange={(e) => setForm({ ...form, vessel_length: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Cabins</label>
                <input type="number" value={form.vessel_cabins} onChange={(e) => setForm({ ...form, vessel_cabins: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputClass}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                  <option value="fundraising">Fundraising</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Display Order</label>
                <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Lower = shown first</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Investment"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
