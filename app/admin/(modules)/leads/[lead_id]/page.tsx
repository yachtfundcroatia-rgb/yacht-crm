"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: string;
  created_at: string;
  assigned_admin_id?: string | null;
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
  const { admin, token } = useAdmin();
  const leadId = params.lead_id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [allowedTransitions, setAllowedTransitions] = useState<string[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState("20000");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Assign
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [assigning, setAssigning] = useState(false);

  async function fetchLead() {
    if (!token) return router.replace("/login");

    const res = await fetch(`${API_URL}/api/admin/leads/${leadId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLead(data.lead);
    setAllowedTransitions(data.allowedTransitions || []);
    setReservation(data.reservation || null);
    setLoading(false);
  }

  async function fetchAdmins() {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/admins`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setAdmins(data);
  }

  useEffect(() => {
    fetchLead();
    if (admin?.role === "superadmin") fetchAdmins();
  }, [leadId, token]);

  async function handleTransition(status: string) {
    setUpdating(true);
    await fetch(`${API_URL}/api/admin/leads/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lead_id: leadId, status }),
    });
    await fetchLead();
    setUpdating(false);
  }

  async function createReservation() {
    try {
      setCreating(true);
      const amount = Number(investmentAmount);
      const deposit = amount * 0.1;
      const remaining = amount * 0.9;

      const res = await fetch(`${API_URL}/api/admin/reservations/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lead_id: leadId,
          investment_ref: "TEST_YACHT_01",
          deposit_amount: deposit,
          remaining_amount: remaining,
          slots_reserved: amount / 10000,
        }),
      });

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

  async function confirmDeposit() {
    try {
      setProcessing(true);
      const res = await fetch(
        `${API_URL}/api/admin/reservations/mark-deposit-paid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lead_id: leadId }),
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

  async function convertToInvestor() {
    try {
      setProcessing(true);
      const res = await fetch(`${API_URL}/api/admin/leads/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lead_id: leadId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert(`Investor created\nPassword: ${data.temporary_password}`);
      await fetchLead();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  }

  async function assignLead() {
    if (!selectedAdmin) return;
    try {
      setAssigning(true);
      const res = await fetch(`${API_URL}/api/admin/leads/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lead_id: leadId,
          new_admin_id: selectedAdmin,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchLead();
      setSelectedAdmin("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAssigning(false);
    }
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!lead) return <div>Lead not found</div>;

  const currentAdmin = admins.find((a) => a.id === lead.assigned_admin_id);

  return (
    <div style={{ padding: 20 }}>
      <h1>{lead.full_name}</h1>
      <p>Status: {lead.status}</p>

      {/* Assign — tylko superadmin */}
      {admin?.role === "superadmin" && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd" }}>
          <h2 style={{ marginBottom: 10 }}>Assign to Admin</h2>
          {currentAdmin && (
            <p style={{ marginBottom: 8, fontSize: 14 }}>
              Currently assigned: <strong>{currentAdmin.email}</strong>
            </p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            >
              <option value="">— select admin —</option>
              {admins.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.email} ({a.role})
                </option>
              ))}
            </select>
            <button
              onClick={assignLead}
              disabled={assigning || !selectedAdmin}
              style={{
                padding: "8px 16px",
                backgroundColor: !selectedAdmin ? "#ccc" : "#0070f3",
                color: "#fff",
                border: "none",
                cursor: !selectedAdmin ? "not-allowed" : "pointer",
              }}
            >
              {assigning ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      )}

      {/* Reservation */}
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
            <p>Deposit Paid: {reservation.deposit_paid_at ? "YES" : "NO"}</p>

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

      {/* Actions */}
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