"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export default function DiscretionaryBonusPage() {
  const { token } = useAdmin();
  const [investors, setInvestors] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [investorRef, setInvestorRef] = useState("");
  const [investmentRef, setInvestmentRef] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/admin/investors`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestors(data); })
      .catch(() => {});
    fetch(`${API_URL}/api/admin/investments`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestments(data); })
      .catch(() => {});
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!investorRef || !investmentRef || !bonusAmount) {
      setMessage({ text: "All fields are required", ok: false });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/system/discretionary-bonus`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ investor_ref: investorRef, investment_ref: investmentRef, bonus_amount: Number(bonusAmount), description: description || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add bonus");
      setMessage({ text: "Bonus added successfully", ok: true });
      setInvestorRef(""); setInvestmentRef(""); setBonusAmount(""); setDescription("");
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">Discretionary Bonus</h1>
        <p className="text-gray-500 text-sm">Add a manual bonus for an investor</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Investor</label>
            <select value={investorRef} onChange={(e) => setInvestorRef(e.target.value)} className={inputClass} required>
              <option value="">— select investor —</option>
              {investors.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.full_name} ({inv.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Investment</label>
            <select value={investmentRef} onChange={(e) => setInvestmentRef(e.target.value)} className={inputClass} required>
              <option value="">— select investment —</option>
              {investments.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.name || inv.id} ({inv.currency} {Number(inv.total_capital).toLocaleString()})</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Bonus Amount (€)</label>
            <input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} placeholder="0" className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Description (optional)</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Year-end loyalty bonus" className={inputClass} />
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-50">
            {loading ? "Adding..." : "Add Bonus"}
          </button>
        </form>
      </div>
    </div>
  );
}
