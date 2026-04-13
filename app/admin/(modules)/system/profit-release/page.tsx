"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export default function ProfitReleasePage() {
  const { token } = useAdmin();
  const [investments, setInvestments] = useState<any[]>([]);
  const [investmentRef, setInvestmentRef] = useState("");
  const [amount, setAmount] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/admin/investments`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestments(data); })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!investmentRef || !token) { setSummary(null); return; }
    fetch(`${API_URL}/api/admin/system/profit-summary?investment_ref=${investmentRef}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setSummary(data))
      .catch(() => setSummary(null));
  }, [investmentRef, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    const available = summary?.remaining_to_release;
    if (available !== undefined && Number(amount) > Number(available)) {
      setMessage({ text: "Amount exceeds available profit", ok: false });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/release-profit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ investment_ref: investmentRef, amount: Number(amount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Release failed");
      setMessage({ text: "Profit released successfully", ok: true });
      setInvestmentRef(""); setAmount(""); setSummary(null);
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setLoading(false); }
  }

  const available = summary?.remaining_to_release;
  const isDisabled = loading || !summary || Number(available) <= 0;

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">Profit Release</h1>
        <p className="text-gray-500 text-sm">Distribute profit to investors</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Investment</label>
            <select value={investmentRef} onChange={(e) => { setInvestmentRef(e.target.value); setAmount(""); setMessage(null); }} className={inputClass} required>
              <option value="">— select investment —</option>
              {investments.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name || inv.id} ({inv.currency} {Number(inv.total_capital).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {summary && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#f8faff] rounded-xl p-3 text-center border border-blue-50">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Profit</div>
                <div className="font-black text-[#0a192f] text-sm">€{Number(summary.total_profit_events).toLocaleString()}</div>
              </div>
              <div className="bg-[#f8faff] rounded-xl p-3 text-center border border-blue-50">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Released</div>
                <div className="font-black text-[#0a192f] text-sm">€{Number(summary.total_released).toLocaleString()}</div>
              </div>
              <div className={`rounded-xl p-3 text-center border ${Number(available) > 0 ? "bg-green-50 border-green-100" : "bg-orange-50 border-orange-100"}`}>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Available</div>
                <div className={`font-black text-sm ${Number(available) > 0 ? "text-green-700" : "text-orange-600"}`}>€{Number(available).toLocaleString()}</div>
              </div>
            </div>
          )}

          {summary && Number(available) <= 0 && (
            <div className="px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-600 font-semibold">
              No profit available to release
            </div>
          )}

          <div>
            <label className={labelClass}>Amount (€)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} required />
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={isDisabled} className="w-full py-3 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-40">
            {loading ? "Processing..." : "Release Profit"}
          </button>
        </form>
      </div>
    </div>
  );
}
