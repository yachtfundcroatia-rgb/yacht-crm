"use client";

import { useEffect, useState } from "react";
import { getWithdrawals, updateWithdrawalStatus } from "@/lib/api";
import { Withdrawal } from "@/lib/types";
import { useAdmin } from "@/app/context/AdminContext";

export default function WithdrawalsPage() {
  const { admin } = useAdmin();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const res = await getWithdrawals();
      setWithdrawals(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleStatusChange(
    id: string,
    newStatus: Withdrawal["status"]
  ) {
    try {
      await updateWithdrawalStatus(id, newStatus);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <div>Loading withdrawals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Withdrawals</h1>

      <table style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Investor</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{w.id.slice(0, 8)}</td>
              <td>{w.investor_ref}</td>
              <td>{w.requested_amount}</td>
              <td>{w.status}</td>
              <td>{new Date(w.created_at).toLocaleString()}</td>
              <td>
                {admin?.role === "superadmin" && (
                  <>
                    {w.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(w.id, "approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(w.id, "rejected")
                          }
                          style={{ marginLeft: 8 }}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {w.status === "approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(w.id, "paid")
                        }
                      >
                        Mark as Paid
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}