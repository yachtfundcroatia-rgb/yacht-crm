"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <SiteHeader />
      <main>
        <ContactHero />
        <ContactContent />
      </main>
      <SiteFooter />
    </div>
  );
}

function ContactHero() {
  const { lang } = useLang();
  const T = t[lang].contact;
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-black text-[#0a192f] mb-6">{T.h1}</h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">{T.p}</p>
      </div>
    </section>
  );
}

function ContactContent() {
  const { lang } = useLang();
  const T = t[lang].contact;
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/public/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lead_type: "contact" }),
      });
      if (res.ok) setSuccess(true);
      else { const d = await res.json(); setError(d.error || "Something went wrong"); }
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <section className="px-6 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-black text-[#0a192f] mb-8">{T.info_title}</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{T.label_email}</div>
                <a href="mailto:hi@yacht.fund" className="font-bold text-[#0a192f] hover:text-[#137fec] transition-colors">hi@yacht.fund</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.44 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{T.label_phone}</div>
                <a href="tel:+38595355133" className="font-bold text-[#0a192f] hover:text-[#137fec] transition-colors">+385 95 35 50 133</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{T.label_office}</div>
                <div className="font-bold text-[#0a192f]">Blue Wave Group d.o.o</div>
                <div className="text-gray-600 text-sm">Bukovačka ulica 23<br />Biograd Na Moru, 23210 Croatia</div>
                <div className="text-gray-400 text-xs mt-1">OIB: 97893023854</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-[#0a192f] mb-2">{T.form_title}</h2>
          <p className="text-sm text-gray-500 mb-6">{T.form_subtitle}</p>
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-lg font-bold text-green-600 mb-2">{T.success_title}</p>
              <p className="text-gray-500 text-sm">{T.success_desc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{T.form_name}</label>
                <input type="text" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{T.form_email}</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{T.form_phone}</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{T.form_message}</label>
                <textarea value={form.message} rows={4} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={T.form_placeholder} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/10 transition-all resize-none" />
              </div>
              {error && <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">{error}</div>}
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors disabled:opacity-50">
                {loading ? T.form_sending : T.form_submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
