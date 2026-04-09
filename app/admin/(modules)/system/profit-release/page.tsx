"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ProfitReleasePage() {
  const { token } = useAdmin();

  const [investments, setInvestments] = useState<any[]>([]);
  const [investmentRef, setInvestmentRef] = useState("");
  const [amount, setAmount] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/admin/investments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInvestments(data);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!investmentRef || !token) {
      setSummary(null);
      return;
    }
    fetch(
      `${API_URL}/api/admin/system/profit-summary?investment_ref=${investmentRef}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((r) => r.json())
      .then((data) => setSummary(data))
      .catch(() => setSummary(null));
  }, [investmentRef, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setMessage("Unauthorized");
      return;
    }

    const available = summary?.remaining_to_release;

    if (available !== undefined && Number(amount) > Number(available)) {
      setMessage("Amount exceeds available profit");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/release-profit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          investment_ref: investmentRef,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Release failed");
      }

      setMessage("✔ Profit released successfully");
      setInvestmentRef("");
      setAmount("");
      setSummary(null);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const available = summary?.remaining_to_release;
  const isDisabled = loading || !summary || Number(available) <= 0;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Profit Release</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Investment
          </label>
          <select
            value={investmentRef}
            onChange={(e) => {
              setInvestmentRef(e.target.value);
              setAmount("");
              setMessage(null);
            }}
            style={{ width: "100%", padding: 8 }}
            required
          >
            <option value="">— select investment —</option>
            {investments.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.id} ({inv.currency} {inv.total_capital})
              </option>
            ))}
          </select>
        </div>

        {summary && (
          <div style={{ marginBottom: 15 }}>
            <div>Total Profit: {summary.total_profit_events}</div>
            <div>Total Released: {summary.total_released}</div>
            <div>
              Available to release: <b>{available}</b>
            </div>
          </div>
        )}

        {summary && Number(available) <= 0 && (
          <div style={{ marginBottom: 15, color: "orange" }}>
            No profit available to release
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <button
          disabled={isDisabled}
          type="submit"
          style={{
            backgroundColor: isDisabled ? "#ccc" : "#0070f3",
            color: "#fff",
            padding: "10px 16px",
            border: "none",
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Release Profit"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}