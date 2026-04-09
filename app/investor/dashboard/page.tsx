"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function InvestorDashboard() {
  const [data, setData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("investor_token");

    if (!token) {
      window.location.href = "/investor/login";
      return;
    }

    async function load() {
      try {
        // dashboard
        const res1 = await fetch(`${API_URL}/api/investor/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const json1 = await res1.json();
        if (!res1.ok) throw new Error(json1.error);

        setData(json1);

        // 🔴 requests
        const res2 = await fetch(`${API_URL}/api/investor/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const json2 = await res2.json();
        if (!res2.ok) throw new Error(json2.error);

        setRequests(json2);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function requestIncrease() {
    try {
      setSending(true);

      const token = localStorage.getItem("investor_token");

      const res = await fetch(`${API_URL}/api/investor/request-increase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to send request");
      }

      alert("Request sent");
      setMessage("");

      // 🔴 reload requests
      const res2 = await fetch(`${API_URL}/api/investor/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const json2 = await res2.json();
      setRequests(json2);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  }

  function format(n: number) {
    return Number(n || 0).toFixed(2);
  }

  function statusColor(status: string) {
    if (status === "approved") return "green";
    if (status === "rejected") return "red";
    return "orange";
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

      <h2 style={{ marginTop: 30 }}>In Progress</h2>
      <div>Reserved Capital: {format(data.reserved_total)}</div>
      <div>Deposit Paid: {format(data.deposit_total)}</div>

      {/* REQUEST FORM */}
      <h2 style={{ marginTop: 30 }}>Increase Investment</h2>

      <textarea
        placeholder="Enter desired amount or message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: 80, marginBottom: 10 }}
      />

      <button onClick={requestIncrease} disabled={sending}>
        {sending ? "Sending..." : "Request Increase"}
      </button>

      {/* 🔴 LISTA REQUESTÓW */}
      <h2 style={{ marginTop: 30 }}>Your Requests</h2>

      {requests.length === 0 && <div>No requests yet</div>}

      {requests.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginTop: 10,
            borderRadius: 6
          }}
        >
          <div><strong>Message:</strong> {r.message}</div>
          <div><strong>Amount:</strong> {format(r.requested_amount)}</div>
          <div>
            <strong>Status:</strong>{" "}
            <span style={{ color: statusColor(r.status) }}>
              {r.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}