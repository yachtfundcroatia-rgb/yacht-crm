"use client";

import { useEffect, useState } from "react";

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

export default function InvestorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [investor, setInvestor] = useState<{ full_name: string; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState<string | null>(null);

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
        if (!meRes.ok) throw new Error(meData.error);

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
        setWithdrawMessage(json.error || "Withdrawal failed");
      } else {
        setWithdrawMessage("Withdrawal request submitted successfully");
        // Refresh data
        const dashRes = await fetch(`${API_URL}/api/investor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dashData = await dashRes.json();
        if (dashRes.ok) setData(dashData);
      }
    } catch {
      setWithdrawMessage("Server error");
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f7f8", fontFamily: "Manrope, sans-serif" }}>
        <p style={{ color: "#6b7280" }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f7f8", fontFamily: "Manrope, sans-serif" }}>
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

  const availableForWithdrawal = Number(data?.balance || 0);
  const netReturnPct = data && Number(data.capital_in) > 0
    ? ((Number(data.profit) + Number(data.bonus)) / Number(data.capital_in) * 100).toFixed(1)
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f8", fontFamily: "Manrope, sans-serif" }}>

      {/* Header */}
      <header style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 40px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>⛵</span>
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: 1, textTransform: "uppercase", color: "#0a192f" }}>
            Yacht Fund
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span style={{ fontWeight: 700, color: "#137fec", fontSize: 14 }}>Dashboard</span>
          <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 14, cursor: "pointer" }}>Payments</span>
          <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 14, cursor: "pointer" }}>Profile</span>
          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              color: "#374151",
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0a192f", marginBottom: 4 }}>
            Investor Dashboard
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Yacht Fund Croatia &nbsp;•&nbsp; Portfolio ID: #{investor?.id}
          </p>
        </div>

        {/* Balance Card */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 24,
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              Total Account Balance
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#0a192f" }}>
              €{fmt(Number(data?.balance))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleWithdraw}
              disabled={withdrawing || availableForWithdrawal <= 0}
              style={{
                padding: "12px 24px",
                background: availableForWithdrawal > 0 ? "#137fec" : "#d1d5db",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                cursor: availableForWithdrawal > 0 ? "pointer" : "not-allowed",
              }}
            >
              {withdrawing ? "Processing..." : "Withdraw Funds"}
            </button>
            <a
              href="/"
              style={{
                padding: "12px 24px",
                background: "white",
                color: "#0a192f",
                border: "2px solid #e5e7eb",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Add Capital
            </a>
          </div>
        </div>

        {withdrawMessage && (
          <div style={{
            padding: "12px 16px",
            marginBottom: 16,
            borderRadius: 8,
            background: withdrawMessage.includes("success") ? "#dcfce7" : "#fee2e2",
            color: withdrawMessage.includes("success") ? "#16a34a" : "#dc2626",
            fontWeight: 600,
            fontSize: 14,
          }}>
            {withdrawMessage}
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💼</div>
              <span style={{ fontWeight: 700, color: "#374151", fontSize: 14 }}>Capital Invested</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0a192f", marginBottom: 4 }}>
              €{fmt(Number(data?.capital_in))}
            </div>
            {data && Number(data.reserved_total) > 0 && (
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                + €{fmt(Number(data.reserved_total))} reserved
              </div>
            )}
          </div>

          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📈</div>
              <span style={{ fontWeight: 700, color: "#374151", fontSize: 14 }}>Total Profit</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0a192f", marginBottom: 4 }}>
              €{fmt(Number(data?.profit))}
            </div>
            {netReturnPct && (
              <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>
                +{netReturnPct}% Net Return
              </div>
            )}
          </div>

          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "#faf5ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎁</div>
              <span style={{ fontWeight: 700, color: "#374151", fontSize: 14 }}>Discretionary Bonus</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0a192f", marginBottom: 4 }}>
              €{fmt(Number(data?.bonus))}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Awarded by fund management</div>
          </div>
        </div>

        {/* Available for Withdrawal */}
        <div style={{
          background: availableForWithdrawal > 0 ? "#eff6ff" : "white",
          borderRadius: 16,
          padding: 24,
          border: `1px solid ${availableForWithdrawal > 0 ? "#bfdbfe" : "#e5e7eb"}`,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, background: "#dbeafe", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💳</div>
              <span style={{ fontWeight: 700, color: "#374151" }}>Available for Withdrawal</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#0a192f" }}>
              €{fmt(availableForWithdrawal)}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              {availableForWithdrawal > 0 ? "Ready for instant payout" : "No funds available yet"}
            </div>
          </div>
          {availableForWithdrawal > 0 && (
            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              style={{
                padding: "12px 28px",
                background: "#137fec",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {withdrawing ? "Processing..." : "Withdraw All"}
            </button>
          )}
        </div>

        {/* Transactions */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 24 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0a192f" }}>Recent Payments</h2>
          </div>

          {!data?.transactions || data.transactions.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#6b7280" }}>
              No transactions yet
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <th style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>Transaction Type</th>
                  <th style={{ padding: "12px 24px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((tx) => {
                  const isNegative = tx.entry_type === "withdrawal";
                  const color = ENTRY_TYPE_COLORS[tx.entry_type] || "#6b7280";
                  const label = ENTRY_TYPE_LABELS[tx.entry_type] || tx.entry_type;
                  return (
                    <tr key={tx.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "16px 24px", fontSize: 14, color: "#374151" }}>
                        {formatDate(tx.created_at)}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }}></div>
                          <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{label}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right", fontSize: 14, fontWeight: 700, color: isNegative ? "#ef4444" : "#16a34a" }}>
                        {isNegative ? "-" : "+"}€{fmt(Math.abs(Number(tx.amount)))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Fund Info */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src="https://images.pexels.com/photos/1480690/pexels-photo-1480690.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Yacht Fund"
              style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 10 }}
            />
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#0a192f", marginBottom: 4 }}>
                Yacht Fund Croatia
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Managed by Yacht Fund Management</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}></div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Active Investment
                </span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
              Fund Performance Status
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#22c55e", letterSpacing: 1 }}>
              OUTPERFORMING
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              Target ROI: 12% annually
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
