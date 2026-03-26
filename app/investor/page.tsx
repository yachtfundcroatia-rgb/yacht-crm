"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function InvestorDashboard() {
  const [investorRef, setInvestorRef] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadDashboard(ref: string) {
    if (!ref) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `${API_URL}/api/investor/dashboard?investor_ref=${ref}`
      );

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

  useEffect(() => {
    const delay = setTimeout(() => {
      loadDashboard(investorRef);
    }, 400);

    return () => clearTimeout(delay);
  }, [investorRef]);

  function format(n: number) {
    return Number(n).toFixed(2);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        Investor Dashboard
      </h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Enter investor_ref (e.g. INV_ae0867a5)"
          value={investorRef}
          onChange={(e) => setInvestorRef(e.target.value)}
          style={{ padding: 10, width: 320 }}
        />
      </div>

      {loading && <div>Loading...</div>}

      {error && (
        <div style={{ color: "red" }}>
          {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: 20 }}>

          <h2>Summary</h2>
          <div>Total Balance: {format(data.total_balance)}</div>
          <div>Total Invested: {format(data.total_invested)}</div>
          <div>Total Profit: {format(data.total_profit)}</div>

          <h2 style={{ marginTop: 20 }}>Transactions</h2>

          <table
            style={{
              marginTop: 10,
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Investment</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {data.transactions.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{t.entry_type}</td>
                  <td>{format(t.amount)}</td>
                  <td>{t.investment_ref}</td>
                  <td>{new Date(t.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}