"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function DiscretionaryBonusPage() {
  const { token } = useAdmin();

  const [investors, setInvestors] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [investorRef, setInvestorRef] = useState("");
  const [investmentRef, setInvestmentRef] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/admin/investors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestors(data); })
      .catch(() => {});

    fetch(`${API_URL}/api/admin/investments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestments(data); })
      .catch(() => {});
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!investorRef || !investmentRef || !bonusAmount) {
      setMessage("All fields are required");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${API_URL}/api/admin/system/discretionary-bonus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            investor_ref: investorRef,
            investment_ref: investmentRef,
            bonus_amount: Number(bonusAmount),
            description: description || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add bonus");
      }

      setMessage("✔ Bonus added successfully");
      setInvestorRef("");
      setInvestmentRef("");
      setBonusAmount("");
      setDescription("");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Discretionary Bonus</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Investor</label>
          <select
            value={investorRef}
            onChange={(e) => setInvestorRef(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          >
            <option value="">— select investor —</option>
            {investors.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.full_name} ({inv.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Investment</label>
          <select
            value={investmentRef}
            onChange={(e) => setInvestmentRef(e.target.value)}
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

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Amount</label>
          <input
            type="number"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Description (optional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Adding..." : "Add Bonus"}
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  );
}