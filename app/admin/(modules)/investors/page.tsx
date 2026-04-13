"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";
import { CheckCircle, TrendingUp, Users } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

interface Investor {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

interface Investment {
  id: string;
  name: string;
  status: string;
  currency: string;
  total_capital: number;
}

interface CapitalPosition {
  investor_ref: string;
  capital_amount: number;
}

export default function InvestorsPage() {
  const { token } = useAdmin();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [capitalPositions, setCapitalPositions] = useState<CapitalPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [selectedInvestment, setSelectedInvestment] = useState("");
  const [capitalAmount, setCapitalAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [investmentStatus, setInvestmentStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function loadData() {
    if (!token) return;
    try {
      const [invRes, investRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/investors`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/investments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const invData = await invRes.json();
      const investData = await investRes.json();
      if (Array.isArray(invData)) setInvestors(invData);
      if (Array.isArray(investData)) setInvestments(investData);
    } catch {}
    setLoading(false);
  }

  async function loadCapitalPositions(investmentRef: string) {
    if (!token || !investmentRef) return;
    try {
      // Use public investments endpoint to get capital data via admin
      const res = await fetch(`${API_URL}/api/admin/investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // We'll show capital from capital_positions via a simple approach
    } catch {}
  }

  useEffect(() => { loadData(); }, [token]);
  useEffect(() => {
    if (selectedInvestment) {
      const inv = investments.find(i => i.id === selectedInvestment);
      if (inv) setInvestmentStatus(inv.status);
    }
  }, [selectedInvestment, investments]);

  async function handleConfirmCapital(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInvestor || !selectedInvestment || !capitalAmount) {
      setMessage({ text: "All fields are required", ok: false });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/investors/${selectedInvestor}/confirm-capital`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ investment_ref: selectedInvestment, capital_amount: Number(capitalAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm capital");
      setMessage({ text: "Capital confirmed and booked to ledger", ok: true });
      setSelectedInvestor(""); setSelectedInvestment(""); setCapitalAmount("");
      loadData();
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setSaving(false); }
  }

  async function handleUpdateInvestmentStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInvestment || !investmentStatus) return;
    setUpdatingStatus(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/investments/${selectedInvestment}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: investmentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      setStatusMsg({ text: "Investment status updated", ok: true });
      loadData();
    } catch (err: any) {
      setStatusMsg({ text: err.message, ok: false });
    } finally { setUpdatingStatus(false); }
  }

  const STATUS_STYLES: Record<string, string> = {
    active: "bg-green-50 text-green-700 border border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    converted: "bg-blue-50 text-blue-700 border border-blue-200",
  };

  const INV_STATUS_STYLES: Record<string, string> = {
    fundraising: "bg-blue-50 text-blue-700 border border-blue-200",
    active: "bg-green-50 text-green-700 border border-green-200",
    upcoming: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    closed: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">Investors & Capital</h1>
        <p className="text-gray-500 text-sm">Manage investor capital and investment status</p>
      </div>

      {/* Investors list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#137fec]" />
          <h2 className="font-black text-[#0a192f]">Investors ({investors.length})</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-xs font-mono text-gray-400">{inv.id}</td>
                <td className="px-6 py-3 text-sm font-semibold text-[#0a192f]">{inv.full_name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{inv.email}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[inv.status] || "bg-gray-100 text-gray-600"}`}>
                    {inv.status || "unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Confirm Capital */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="font-black text-[#0a192f]">Confirm Capital Payment</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Book full capital payment to ledger. Use after investor transfers the remaining 90%.</p>
          <form onSubmit={handleConfirmCapital} className="space-y-4">
            <div>
              <label className={labelClass}>Investor</label>
              <select value={selectedInvestor} onChange={(e) => setSelectedInvestor(e.target.value)} className={inputClass} required>
                <option value="">— select investor —</option>
                {investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.full_name} ({inv.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Investment</label>
              <select value={selectedInvestment} onChange={(e) => setSelectedInvestment(e.target.value)} className={inputClass} required>
                <option value="">— select investment —</option>
                {investments.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.name || inv.id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Capital Amount (€)</label>
              <input
                type="number"
                value={capitalAmount}
                onChange={(e) => setCapitalAmount(e.target.value)}
                placeholder="e.g. 10000"
                className={inputClass}
                required
              />
              <p className="text-xs text-gray-400 mt-1">Enter full capital amount (deposit already paid separately)</p>
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={saving} className="w-full py-3 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-50">
              {saving ? "Confirming..." : "Confirm Capital Payment"}
            </button>
          </form>
        </div>

        {/* Investment Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-[#137fec]" />
            <h2 className="font-black text-[#0a192f]">Investment Status</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Change investment status. Set to <strong>active</strong> when all capital is collected to enable profit distribution.</p>

          <div className="space-y-4 mb-4">
            {investments.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-[#f8faff] rounded-xl border border-blue-50">
                <div>
                  <div className="text-sm font-bold text-[#0a192f]">{inv.name || inv.id}</div>
                  <div className="text-xs text-gray-400">{inv.id}</div>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${INV_STATUS_STYLES[inv.status] || "bg-gray-100 text-gray-600"}`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleUpdateInvestmentStatus} className="space-y-4">
            <div>
              <label className={labelClass}>Investment</label>
              <select value={selectedInvestment} onChange={(e) => setSelectedInvestment(e.target.value)} className={inputClass} required>
                <option value="">— select investment —</option>
                {investments.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.name || inv.id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>New Status</label>
              <select value={investmentStatus} onChange={(e) => setInvestmentStatus(e.target.value)} className={inputClass} required>
                <option value="">— select status —</option>
                <option value="fundraising">Fundraising</option>
                <option value="active">Active (enables profit distribution)</option>
                <option value="upcoming">Upcoming</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {statusMsg && (
              <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${statusMsg.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                {statusMsg.text}
              </div>
            )}

            <button type="submit" disabled={updatingStatus} className="w-full py-3 bg-[#0a192f] text-white rounded-xl font-bold hover:bg-[#0f2848] transition-colors disabled:opacity-50">
              {updatingStatus ? "Updating..." : "Update Status"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
