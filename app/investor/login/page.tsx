"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function InvestorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/investor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("investor_token", data.token);
      window.location.href = "/investor/dashboard";

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "Manrope, sans-serif" }}>

      {/* Header */}
      <header className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">⛵</span>
          <img src="https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/YACHT%20FUND%20blue%20main%20.png" alt="Yacht Fund" className="h-8 w-auto object-contain" />
        </Link>
        <Link
          href="/login"
          className="text-sm font-semibold text-gray-500 hover:text-[#137fec] transition-colors no-underline"
        >
          Admin Login
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">

            {/* Icon */}
            <div className="w-14 h-14 bg-[#eff6ff] rounded-2xl flex items-center justify-center mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            <h1 className="text-2xl font-black text-[#0a192f] mb-1">Investor Portal</h1>
            <p className="text-sm text-gray-500 mb-8">Sign in to access your investment dashboard</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span className="text-sm text-red-600 font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Having trouble? Contact{" "}
                <a href="mailto:invest@yachtfund.com" className="text-[#137fec] font-semibold hover:underline">
                  invest@yachtfund.com
                </a>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Financial investments in yachting carry risks. Consult your advisor.
          </p>
        </div>
      </div>
    </div>
  );
}
