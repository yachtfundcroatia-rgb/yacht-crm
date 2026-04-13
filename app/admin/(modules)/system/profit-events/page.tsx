"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export default function ProfitEventsPage() {
  const { token } = useAdmin();
  const [investments, setInvestments] = useState<any[]>([]);
  const [investmentRef, setInvestmentRef] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/admin/investments`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestments(data); })
      .catch(() => {});
  }, [token]);

  async function createEvent() {
    if (!investmentRef || !amount) {
      setMessage({ text: "Investment and amount are required", ok: false });
      return;
    }
    try {
      setLoading(true);
      setMessage(null);
      const res = await fetch(`${API_URL}/api/admin/system/profit-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ investment_ref: investmentRef, period, amount: Number(amount), source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");
      setMessage({ text: "Profit event created successfully", ok: true });
      setInvestmentRef(""); setPeriod(""); setAmount(""); setSource("");
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">Profit Events</h1>
        <p className="text-gray-500 text-sm">Register a new profit event for an investment</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Investment</label>
            <select value={investmentRef} onChange={(e) => setInvestmentRef(e.target.value)} className={inputClass}>
              <option value="">— select investment —</option>
              {investments.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name || inv.id} ({inv.currency} {Number(inv.total_capital).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Period (e.g. Q1 2026)</label>
            <input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Q1 2026" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Amount (€)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Source</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. armator report" className={inputClass} />
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
              {message.text}
            </div>
          )}

          <button
            onClick={createEvent}
            disabled={loading}
            className="w-full py-3 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
