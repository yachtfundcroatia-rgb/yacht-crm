"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ProfitEventsPage() {

  const [investmentRef, setInvestmentRef] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function createEvent() {

    try {

      setLoading(true);
      setMessage(null);

      const token = localStorage.getItem("admin_token");

      if (!token) {
        setMessage("Not authenticated");
        return;
      }

      const res = await fetch(`${API_URL}/api/admin/system/profit-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          investment_ref: investmentRef,
          period,
          amount: Number(amount),
          source
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      setMessage("Profit event created");

      setInvestmentRef("");
      setPeriod("");
      setAmount("");
      setSource("");

    } catch (err: any) {

      setMessage(err.message || "Error");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div style={{ maxWidth: 500 }}>

      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        Profit Events
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

        <input
          placeholder="Investment Ref"
          value={investmentRef}
          onChange={(e) => setInvestmentRef(e.target.value)}
        />

        <input
          placeholder="Period (e.g. Q1 2026)"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Source (e.g. armator report)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <button
          onClick={createEvent}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

        {message && (
          <div style={{ marginTop: 10 }}>
            {message}
          </div>
        )}

      </div>

    </div>
  );
}