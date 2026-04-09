"use client";

import { updateWithdrawalStatus } from "@/lib/api";
import { Withdrawal, WithdrawalStatus } from "@/lib/types";

interface Props {
  withdrawals: Withdrawal[];
  reload: () => void;
}

export default function WithdrawalsTable({ withdrawals, reload }: Props) {

  async function handleStatusChange(id: string, status: WithdrawalStatus) {
    try {
      await updateWithdrawalStatus(id, status);
      reload();
    } catch (err: any) {
      alert(err.message || "Failed to update withdrawal");
    }
  }

  if (withdrawals.length === 0) {
    return <p>No withdrawal requests.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
      <thead>
        <tr>
          <th style={th}>ID</th>
          <th style={th}>Investor</th>
          <th style={th}>Amount</th>
          <th style={th}>Status</th>
          <th style={th}>Requested</th>
          <th style={th}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {withdrawals.map((w) => (
          <tr key={w.id}>
            <td style={td}>{w.id.slice(0, 8)}</td>
            <td style={td}>{w.investor_ref}</td>
            <td style={td}>{w.requested_amount}</td>
            <td style={td}>{w.status}</td>
            <td style={td}>
              {new Date(w.created_at).toLocaleString()}
            </td>
            <td style={td}>
              {w.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange(w.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(w.id, "rejected")}
                    style={{ marginLeft: 8 }}
                  >
                    Reject
                  </button>
                </>
              )}

              {w.status === "approved" && (
                <button
                  onClick={() => handleStatusChange(w.id, "paid")}
                >
                  Mark as Paid
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const td: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};