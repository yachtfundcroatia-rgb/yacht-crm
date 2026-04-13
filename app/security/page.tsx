"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CallModal from "@/components/CallModal";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <SiteHeader />
      <main>
        <SecurityHero />
        <CapitalProtection />
        <FAQSection />
        <SecurityCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

function SecurityHero() {
  const { lang } = useLang();
  const T = t[lang].sec;
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-black text-[#0a192f] mb-6">{T.h1}</h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{T.p}</p>
      </div>
    </section>
  );
}

function CapitalProtection() {
  const { lang } = useLang();
  const T = t[lang].sec;
  const icons = [
    <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    <svg key="5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  ];
  return (
    <section className="px-6 lg:px-20 py-16 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-[#0a192f] mb-10 flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          {T.prot_title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {T.prot.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">{icons[i]}</div>
              <h3 className="font-black text-[#0a192f] mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { lang } = useLang();
  const T = t[lang].sec;
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? T.faqs : T.faqs.slice(0, 5);

  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center text-[#0a192f] mb-3">{T.faq_title}</h2>
        <p className="text-center text-gray-500 mb-12">{T.faq_subtitle}</p>
        <div className="space-y-3">
          {visible.map((faq, i) => (
            <div key={i} className="bg-[#f6f7f8] rounded-xl overflow-hidden border border-gray-100">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <span className="font-bold text-[#0a192f] pr-4 text-sm">{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open === i && <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">{faq.a}</div>}
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="mt-6 text-center">
            <button onClick={() => setShowAll(true)} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#137fec] text-[#137fec] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              {T.faq_show_all}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        )}
        {showAll && (
          <div className="mt-6 text-center">
            <button onClick={() => { setShowAll(false); setOpen(null); }} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
              {T.faq_show_less}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SecurityCTA() {
  const { lang } = useLang();
  const T = t[lang].sec;
  const [callOpen, setCallOpen] = useState(false);
  return (
    <>
      <section className="px-6 lg:px-20 py-16 bg-[#f6f7f8]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#137fec] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-black text-white mb-3">{T.cta_title}</h2>
            <p className="text-blue-100 mb-8">{T.cta_desc}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => setCallOpen(true)} className="px-8 py-3 bg-white text-[#137fec] rounded-xl font-bold hover:bg-blue-50 transition-colors">{T.cta_call}</button>
              <a href="mailto:hi@yacht.fund" className="px-8 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all">{T.cta_email}</a>
            </div>
          </div>
        </div>
      </section>
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
