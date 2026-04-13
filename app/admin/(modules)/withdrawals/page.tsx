"use client";

import { useEffect, useState } from "react";
import { getWithdrawals, updateWithdrawalStatus } from "@/lib/api";
import { Withdrawal } from "@/lib/types";
import { useAdmin } from "@/app/context/AdminContext";
import { CheckCircle, XCircle, CreditCard } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  approved: "bg-blue-50 text-blue-700 border border-blue-200",
  paid: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

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

  useEffect(() => { loadData(); }, []);

  async function handleStatusChange(id: string, newStatus: Withdrawal["status"]) {
    try {
      await updateWithdrawalStatus(id, newStatus);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm">{error}</div>
  );

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">Withdrawals</h1>
        <p className="text-gray-500 text-sm">{withdrawals.length} total requests</p>
      </div>

      {withdrawals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">No withdrawal requests yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Investor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Requested</th>
                {admin?.role === "superadmin" && (
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{w.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#0a192f]">{w.investor_ref}</td>
                  <td className="px-6 py-4 text-sm font-black text-[#0a192f]">€{Number(w.requested_amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[w.status] || "bg-gray-100 text-gray-600"}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(w.created_at).toLocaleString()}</td>
                  {admin?.role === "superadmin" && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {w.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(w.id, "approved")}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(w.id, "rejected")}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                        {w.status === "approved" && (
                          <button
                            onClick={() => handleStatusChange(w.id, "paid")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
