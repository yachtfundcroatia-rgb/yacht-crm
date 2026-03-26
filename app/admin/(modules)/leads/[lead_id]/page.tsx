"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: string;
  created_at: string;
}

interface Reservation {
  deposit_amount: number;
  remaining_amount: number;
  status: string;
  deposit_paid_at?: string | null;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.lead_id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const [allowedTransitions, setAllowedTransitions] = useState<string[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState("20000");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 🔴 NEW
  const [processing, setProcessing] = useState(false);

  async function fetchLead() {
    const token = localStorage.getItem("admin_token");
    if (!token) return router.replace("/login");

    const res = await fetch(`${API_URL}/api/admin/leads/${leadId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    setLead(data.lead);
    setAllowedTransitions(data.allowedTransitions || []);
    setReservation(data.reservation || null);
    setLoading(false);
  }

  async function handleTransition(status: string) {
    const token = localStorage.getItem("admin_token");

    setUpdating(true);

    await fetch(`${API_URL}/api/admin/leads/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        lead_id: leadId,
        status
      })
    });

    await fetchLead();
    setUpdating(false);
  }

  async function createReservation() {
    try {
      setCreating(true);

      const token = localStorage.getItem("admin_token");

      const amount = Number(investmentAmount);

      const deposit = amount * 0.1;
      const remaining = amount * 0.9;

      const res = await fetch(
        `${API_URL}/api/admin/reservations/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            lead_id: leadId,
            investment_ref: "TEST_YACHT_01",
            deposit_amount: deposit,
            remaining_amount: remaining,
            slots_reserved: amount / 10000
          })
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      await handleTransition("waiting_for_transfer");

    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  // 🔴 NEW — CONFIRM DEPOSIT
  async function confirmDeposit() {
    try {
      setProcessing(true);

      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `${API_URL}/api/admin/reservations/mark-deposit-paid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            lead_id: leadId
          })
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      await fetchLead();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  }

  // 🔴 NEW — CONVERT
  async function convertToInvestor() {
    try {
      setProcessing(true);

      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `${API_URL}/api/admin/leads/convert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            lead_id: leadId
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      alert(`Investor created\nPassword: ${data.temporary_password}`);

      await fetchLead();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  }

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!lead) return <div>Lead not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{lead.full_name}</h1>

      <p>Status: {lead.status}</p>

      <div style={{ marginTop: 30 }}>
        <h2>Reservation</h2>

        {!reservation && (
          <div>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
            />
            <button onClick={createReservation} disabled={creating}>
              Create Reservation
            </button>
          </div>
        )}

        {reservation && (
          <div style={{ padding: 10, border: "1px solid #ddd" }}>
            <p>Deposit: {reservation.deposit_amount}</p>
            <p>Remaining: {reservation.remaining_amount}</p>
            <p>Status: {reservation.status}</p>
            <p>
              Deposit Paid:{" "}
              {reservation.deposit_paid_at ? "YES" : "NO"}
            </p>

            {!reservation.deposit_paid_at && (
              <button onClick={confirmDeposit} disabled={processing}>
                Confirm Deposit
              </button>
            )}

            {reservation.deposit_paid_at && (
              <button onClick={convertToInvestor} disabled={processing}>
                Convert to Investor
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Actions</h2>

        {allowedTransitions.map((t) => (
          <button
            key={t}
            onClick={() => handleTransition(t)}
            disabled={updating}
            style={{ marginRight: 10 }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}