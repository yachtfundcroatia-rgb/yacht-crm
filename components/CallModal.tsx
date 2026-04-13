"use client";

import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CallModal({ open, onClose }: Props) {
  const { lang } = useLang();
  const T = t[lang].modal;
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", preferred_call_time: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setSuccess(false);
    setForm({ full_name: "", email: "", phone: "", preferred_call_time: "" });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/public/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lead_type: "book_a_call" }),
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
          <h3 className="text-2xl font-black text-[#0a192f] mb-1">{T.call_title}</h3>
          <p className="text-sm text-gray-500 mb-6">{T.call_subtitle}</p>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-bold text-green-600">{T.call_success}</p>
              <button onClick={handleClose} className="mt-4 text-sm text-gray-500 hover:text-gray-700">{T.invest_close}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{T.invest_name}</label>
                <input type="text" required value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{T.invest_email}</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{T.invest_phone}</label>
                <input type="tel" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{T.call_time}</label>
                <select value={form.preferred_call_time}
                  onChange={(e) => setForm({ ...form, preferred_call_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#137fec] outline-none text-sm bg-white">
                  <option value="">—</option>
                  <option value="morning">{T.call_morning}</option>
                  <option value="afternoon">{T.call_afternoon}</option>
                  <option value="evening">{T.call_evening}</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#0a192f] text-white rounded-lg font-bold hover:bg-[#0f2848] transition-colors disabled:opacity-50">
                {loading ? T.invest_sending : T.call_submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
