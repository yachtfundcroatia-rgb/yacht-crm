"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";
import { Users } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Investor {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700 border border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  converted: "bg-blue-50 text-blue-700 border border-blue-200",
};

export default function InvestorsPage() {
  const { token } = useAdmin();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/admin/investors`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestors(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-[#137fec]" />
        <div>
          <h1 className="text-2xl font-black text-[#0a192f] mb-0.5">Investors</h1>
          <p className="text-gray-500 text-sm">{investors.length} investors · Manage capital in investor lead card</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {investors.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No investors yet.</td></tr>
            ) : investors.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-gray-400">{inv.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-[#0a192f]">{inv.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{inv.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[inv.status] || "bg-gray-100 text-gray-600"}`}>
                    {inv.status || "unknown"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
