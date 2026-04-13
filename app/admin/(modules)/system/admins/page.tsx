"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";
import { Shield, User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all bg-white";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

const ROLE_STYLES: Record<string, string> = {
  superadmin: "bg-purple-50 text-purple-700 border border-purple-200",
  sales: "bg-blue-50 text-blue-700 border border-blue-200",
};

export default function AdminManagementPage() {
  const { token } = useAdmin();
  const [admins, setAdmins] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function fetchAdmins() {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/admins`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (Array.isArray(data)) setAdmins(data);
  }

  useEffect(() => { fetchAdmins(); }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !role) {
      setMessage({ text: "All fields are required", ok: false });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");
      setMessage({ text: "Admin created successfully", ok: true });
      setEmail(""); setPassword(""); setRole("sales");
      fetchAdmins();
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">Admin Management</h1>
        <p className="text-gray-500 text-sm">{admins.length} admin accounts</p>
      </div>

      {/* Admins list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-black text-[#0a192f]">Current Admins</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-[#0a192f]">{admin.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${ROLE_STYLES[admin.role] || "bg-gray-100 text-gray-600"}`}>
                    {admin.role === "superadmin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(admin.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new admin */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-[#0a192f] mb-5">Add New Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
              <option value="sales">Sales</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-semibold ${message.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
