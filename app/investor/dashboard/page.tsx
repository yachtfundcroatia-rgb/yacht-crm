"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function InvestorDashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("investor_token");

    if (!token) {
      window.location.href = "/investor/login";
      return;
    }

    async function loadDashboard() {
      try {
        const res = await fetch(`${API_URL}/api/investor/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load dashboard");
        }

        setData(json);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function format(n: number) {
    return Number(n).toFixed(2);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (error)
    return (
      <div style={{ padding: 20, color: "red" }}>
        {error}
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h1>Investor Dashboard</h1>

      <h2>Summary</h2>
      <div>Total Balance: {format(data.balance)}</div>
      <div>Total Invested: {format(data.capital_in)}</div>
      <div>Total Profit: {format(data.profit)}</div>

      {/* 🔥 brak transactions — na razie usuwamy */}
    </div>
  );
}