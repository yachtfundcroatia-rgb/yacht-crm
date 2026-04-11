"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Props {
  open: boolean;
  onClose: () => void;
  defaultAmount?: string;
}

export default function InvestModal({ open, onClose, defaultAmount = "" }: Props) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", investment_amount: defaultAmount });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setSuccess(false);
    setForm({ full_name: "", email: "", phone: "", investment_amount: "" });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/public/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          investment_amount: form.investment_amount ? Number(form.investment_amount) : null,
          lead_type: "invest_now",
        }),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={handleClose} className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-3xl font-light leading-none">×</button>
        <div className="p-8">
          <h3 className="text-2xl font-black text-[#0a192f] mb-1">Invest Now</h3>
          <p className="text-sm text-gray-500 mb-6">Tell us about your investment interest</p>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-bold text-green-600">Thank you! We'll be in touch shortly.</p>
              <button onClick={handleClose} className="mt-4 text-sm text-gray-500 hover:text-gray-700">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input type="text" required value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm"
                  placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm"
                  placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm"
                  placeholder="+48 123 456 789" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Investment Amount (€)</label>
                <select value={form.investment_amount}
                  onChange={(e) => setForm({ ...form, investment_amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm bg-white">
                  <option value="">Select amount</option>
                  <option value="10000">€10,000</option>
                  <option value="25000">€25,000</option>
                  <option value="50000">€50,000</option>
                  <option value="100000">€100,000</option>
                  <option value="250000">€250,000+</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#137fec] text-white rounded-lg font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-50">
                {loading ? "Sending..." : "Submit Interest"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}