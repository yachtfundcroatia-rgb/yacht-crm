"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ProfitEventsPage() {
  const { token } = useAdmin();

  const [investments, setInvestments] = useState<any[]>([]);
  const [investmentRef, setInvestmentRef] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
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

  async function createEvent() {
    if (!investmentRef || !amount) {
      setMessage("Investment and amount are required");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(`${API_URL}/api/admin/system/profit-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          investment_ref: investmentRef,
          period,
          amount: Number(amount),
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      setMessage("✔ Profit event created");
      setInvestmentRef("");
      setPeriod("");
      setAmount("");
      setSource("");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Profit Events</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            Investment
          </label>
          <select
            value={investmentRef}
            onChange={(e) => setInvestmentRef(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">— select investment —</option>
            {investments.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.id} ({inv.currency} {inv.total_capital})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            Period (e.g. Q1 2026)
          </label>
          <input
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            Source (e.g. armator report)
          </label>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button
          onClick={createEvent}
          disabled={loading}
          style={{
            padding: "10px 16px",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

        {message && <div style={{ marginTop: 10 }}>{message}</div>}
      </div>
    </div>
  );
}