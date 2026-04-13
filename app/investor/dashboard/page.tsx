"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  User,
  LogOut,
  TrendingUp,
  Wallet,
  Gift,
  ArrowDownToLine,
  Anchor,
  BadgeCheck,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface DashboardData {
  investor_ref: string;
  capital_in: number;
  profit: number;
  bonus: number;
  withdrawn: number;
  balance: number;
  reserved_total: number;
  deposit_total: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  entry_type: string;
  amount: number;
  created_at: string;
  investment_ref: string;
}

const ENTRY_TYPE_LABELS: Record<string, string> = {
  capital_in: "Capital Investment",
  profit_payout: "Dividend Payout",
  discretionary_bonus: "Bonus Credit",
  withdrawal: "Withdrawal",
  company_profit: "Profit Share",
};

const ENTRY_TYPE_COLORS: Record<string, string> = {
  capital_in: "#137fec",
  profit_payout: "#22c55e",
  discretionary_bonus: "#8b5cf6",
  withdrawal: "#ef4444",
  company_profit: "#22c55e",
};

function fmt(n: number) {
  return Number(n || 0).toLocaleString("en-EU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InvestorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [investor, setInvestor] = useState<{ full_name: string; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "payments" | "profile">("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("investor_token");
    if (!token) {
      window.location.href = "/investor/login";
      return;
    }

    async function load() {
      try {
        const [dashRes, meRes] = await Promise.all([
          fetch(`${API_URL}/api/investor/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/investor/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dashData = await dashRes.json();
        const meData = await meRes.json();

        if (!dashRes.ok) throw new Error(dashData.error);
        setData(dashData);
        setInvestor(meData.investor);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleWithdraw() {
    const token = localStorage.getItem("investor_token");
    if (!token || !data) return;

    setWithdrawing(true);
    setWithdrawMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/investor/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ investment_ref: data.investor_ref }),
      });

      const json = await res.json();

      if (!res.ok) {
        setWithdrawMessage({ text: json.error || "Withdrawal failed", ok: false });
      } else {
        setWithdrawMessage({ text: "Withdrawal request submitted successfully", ok: true });
        const dashRes = await fetch(`${API_URL}/api/investor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dashData = await dashRes.json();
        if (dashRes.ok) setData(dashData);
      }
    } catch {
      setWithdrawMessage({ text: "Server error", ok: false });
    } finally {
      setWithdrawing(false);
    }
  }

  function logout() {
    localStorage.removeItem("investor_token");
    window.location.href = "/investor/login";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8]" style={{ fontFamily: "Manrope, sans-serif" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8]" style={{ fontFamily: "Manrope, sans-serif" }}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.href = "/investor/login"} className="text-[#137fec] font-bold text-sm">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const availableForWithdrawal = Number(data?.balance || 0);
  const netReturnPct = data && Number(data.capital_in) > 0
    ? ((Number(data.profit) + Number(data.bonus)) / Number(data.capital_in) * 100).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#f6f7f8]" style={{ fontFamily: "Manrope, sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 lg:px-10 h-16 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img src="https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/YACHT%20FUND%20blue%20main%20.png" alt="Yacht Fund" className="h-8 w-auto object-contain" />
          <span className="font-black text-base tracking-tight uppercase text-[#0a192f]">Yacht Fund</span>
        </Link>

        <nav className="flex items-center gap-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "payments", label: "Payments", icon: CreditCard },
            { id: "profile", label: "Profile", icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === id
                  ? "bg-[#eff6ff] text-[#137fec]"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-10">

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <>
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#0a192f] mb-1">Investor Dashboard</h1>
              <p className="text-sm text-gray-500">
                Yacht Fund Croatia &nbsp;•&nbsp; Portfolio ID: #{investor?.id}
              </p>
            </div>

            {/* Balance Card */}
            <div className="bg-white rounded-2xl p-7 mb-5 border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Account Balance</div>
                <div className="text-4xl font-black text-[#0a192f]">€{fmt(Number(data?.balance))}</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing || availableForWithdrawal <= 0}
                  className="flex items-center gap-2 px-5 py-3 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  {withdrawing ? "Processing..." : "Withdraw Funds"}
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="flex items-center gap-2 px-5 py-3 bg-white text-[#0a192f] border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-gray-400 transition-colors"
                >
                  Add Capital
                </button>
              </div>
            </div>

            {withdrawMessage && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm font-semibold ${withdrawMessage.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                {withdrawMessage.text}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-[#137fec]" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Capital Invested</span>
                </div>
                <div className="text-2xl font-black text-[#0a192f]">€{fmt(Number(data?.capital_in))}</div>
                {data && Number(data.reserved_total) > 0 && (
                  <div className="text-xs text-gray-400 mt-1">+ €{fmt(Number(data.reserved_total))} reserved</div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Total Profit</span>
                </div>
                <div className="text-2xl font-black text-[#0a192f]">€{fmt(Number(data?.profit))}</div>
                {netReturnPct && (
                  <div className="text-xs text-green-600 font-bold mt-1">+{netReturnPct}% Net Return</div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Discretionary Bonus</span>
                </div>
                <div className="text-2xl font-black text-[#0a192f]">€{fmt(Number(data?.bonus))}</div>
                <div className="text-xs text-gray-400 mt-1">Awarded by fund management</div>
              </div>
            </div>

            {/* Available for Withdrawal */}
            <div className={`rounded-2xl p-6 mb-5 border shadow-sm flex items-center justify-between flex-wrap gap-4 ${availableForWithdrawal > 0 ? "bg-[#eff6ff] border-blue-200" : "bg-white border-gray-100"}`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#137fec]" />
                  </div>
                  <span className="font-bold text-gray-700">Available for Withdrawal</span>
                </div>
                <div className="text-3xl font-black text-[#0a192f]">€{fmt(availableForWithdrawal)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {availableForWithdrawal > 0 ? "Ready for instant payout" : "No funds available yet"}
                </div>
              </div>
              {availableForWithdrawal > 0 && (
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="flex items-center gap-2 px-6 py-3 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors disabled:opacity-50"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  {withdrawing ? "Processing..." : "Withdraw All"}
                </button>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
              <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                <h2 className="font-black text-[#0a192f] text-lg">Recent Payments</h2>
                <button
                  onClick={() => setActiveTab("payments")}
                  className="text-sm font-bold text-[#137fec] hover:underline"
                >
                  View All History
                </button>
              </div>

              {!data?.transactions || data.transactions.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No transactions yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Type</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.slice(0, 5).map((tx) => {
                      const isNeg = tx.entry_type === "withdrawal";
                      const color = ENTRY_TYPE_COLORS[tx.entry_type] || "#6b7280";
                      const label = ENTRY_TYPE_LABELS[tx.entry_type] || tx.entry_type;
                      return (
                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(tx.created_at)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}></div>
                              <span className="text-sm font-semibold text-gray-800">{label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: isNeg ? "#ef4444" : "#16a34a" }}>
                            {isNeg ? "-" : "+"}€{fmt(Math.abs(Number(tx.amount)))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Fund Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.pexels.com/photos/1480690/pexels-photo-1480690.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Yacht Fund"
                  className="w-20 h-14 object-cover rounded-xl"
                />
                <div>
                  <div className="font-black text-[#0a192f] mb-1">Yacht Fund Croatia</div>
                  <div className="text-sm text-gray-500">Managed by Yacht Fund Management</div>
                  <div className="flex items-center gap-2 mt-2">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Active Investment</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fund Performance</div>
                <div className="text-xl font-black text-green-600 tracking-wide">OUTPERFORMING</div>
                <div className="text-xs text-gray-400 mt-1">Target ROI: 12% annually</div>
              </div>
            </div>
          </>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#0a192f] mb-1">Payment History</h1>
              <p className="text-sm text-gray-500">All transactions on your account</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {!data?.transactions || data.transactions.length === 0 ? (
                <div className="py-16 text-center text-gray-400">No transactions yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((tx) => {
                      const isNeg = tx.entry_type === "withdrawal";
                      const color = ENTRY_TYPE_COLORS[tx.entry_type] || "#6b7280";
                      const label = ENTRY_TYPE_LABELS[tx.entry_type] || tx.entry_type;
                      return (
                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(tx.created_at)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}></div>
                              <span className="text-sm font-semibold text-gray-800">{label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400 font-mono">{tx.investment_ref}</td>
                          <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: isNeg ? "#ef4444" : "#16a34a" }}>
                            {isNeg ? "-" : "+"}€{fmt(Math.abs(Number(tx.amount)))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#0a192f] mb-1">Profile</h1>
              <p className="text-sm text-gray-500">Your account details</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-16 h-16 bg-[#eff6ff] rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-[#137fec]" />
                </div>
                <div>
                  <div className="font-black text-xl text-[#0a192f]">{investor?.full_name}</div>
                  <div className="text-sm text-gray-500">Investor ID: #{investor?.id}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Investor ID</div>
                  <div className="font-semibold text-gray-800">{investor?.id}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fund</div>
                  <div className="font-semibold text-gray-800">Yacht Fund Croatia</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-bold text-green-700">Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">Need to update your details or request capital increase?</p>
                <a
                  href="mailto:invest@yachtfund.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors no-underline"
                >
                  Contact Fund Manager
                </a>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
