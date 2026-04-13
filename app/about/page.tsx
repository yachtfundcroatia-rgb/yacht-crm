"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InvestModal from "@/components/InvestModal";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <SiteHeader />
      <main>
        <AboutHero />
        <Mission />
        <Founder />
        <Partner />
        <AboutCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

function AboutHero() {
  const { lang } = useLang();
  const T = t[lang].about;
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
          <span className="text-[#137fec] text-xs font-black uppercase tracking-widest">{T.badge}</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-[#0a192f] mb-6 max-w-3xl">{T.h1}</h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{T.p}</p>
      </div>
    </section>
  );
}

function Mission() {
  const { lang } = useLang();
  const T = t[lang].about;
  const icons = [
    <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  ];
  const vals = [
    { title: T.val1_title, desc: T.val1_desc },
    { title: T.val2_title, desc: T.val2_desc },
    { title: T.val3_title, desc: T.val3_desc },
  ];
  return (
    <section className="px-6 lg:px-20 py-20 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">{T.mission_title}</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-12"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {vals.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5">{icons[i]}</div>
              <h3 className="font-black text-[#0a192f] mb-3">{v.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founder() {
  const { lang } = useLang();
  const T = t[lang].about;
  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">{T.founder_title}</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-12"></div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-5 mb-6">
              <img src="https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/Ja%20yacht.JPG" alt="Jacek Dziemidok" className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 shadow-md" />
              <div>
                <h3 className="text-2xl font-black text-[#0a192f]">Jacek Dziemidok</h3>
                <p className="text-[#137fec] font-bold">{T.founder_role}</p>
                <a href="https://www.linkedin.com/in/dziemidok/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#137fec] transition-colors mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{T.founder_p1}</p>
              <p>{T.founder_p2}</p>
              <p>{T.founder_p3}</p>
            </div>
          </div>
          <div className="bg-[#f8faff] rounded-2xl p-8 border border-blue-50 shadow-md">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6">The Opportunity I Saw</div>
            <div className="space-y-5">
              {[
                { label: "Croatia charter market growth", value: "Consistent year-on-year" },
                { label: "Average fleet occupancy", value: "50–97% peak season" },
                { label: "Minimum individual investment", value: "€10,000" },
                { label: "Net annual return target", value: "Up to 12%" },
                { label: "Investment term", value: "6 years with early exit option" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start border-b border-blue-100 pb-4 last:border-0 last:pb-0">
                  <span className="text-sm text-gray-600 max-w-[60%]">{item.label}</span>
                  <span className="text-sm font-black text-[#0a192f] text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Partner() {
  const { lang } = useLang();
  const T = t[lang].about;
  const stats = [
    { value: "300+", label: T.partner_stat1 },
    { value: "30+", label: T.partner_stat2 },
    { value: "6+", label: T.partner_stat3 },
    { value: "10%", label: T.partner_stat4 },
  ];
  return (
    <section className="px-6 lg:px-20 py-20 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">{T.partner_title}</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-12"></div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l2-8h14l2 8H3z"/><path d="M12 17V5"/><path d="M5 9c0-2 1.5-4 7-4s7 2 7 4"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0a192f]">Angelina Yachts</h3>
                <p className="text-gray-500 text-sm">Biograd Na Moru, Croatia</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">{T.partner_desc1}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{T.partner_desc2}</p>
            <a href="https://www.angelina.hr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#137fec] text-[#137fec] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              {T.partner_btn}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#f8faff] rounded-xl p-6 text-center border border-blue-50">
                <div className="text-3xl font-black text-[#137fec] mb-1">{s.value}</div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  const { lang } = useLang();
  const T = t[lang].about;
  const [investOpen, setInvestOpen] = useState(false);
  return (
    <>
      <section className="px-6 lg:px-20 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a192f] rounded-2xl p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-black text-white mb-3">{T.cta_title}</h2>
              <p className="text-slate-300">{T.cta_desc}</p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <button onClick={() => setInvestOpen(true)} className="min-w-[160px] rounded-xl h-14 px-8 bg-[#137fec] text-white font-bold flex items-center justify-center hover:bg-[#0f6fd4] transition-colors">{T.cta_invest}</button>
              <a href="/contact" className="min-w-[160px] rounded-xl h-14 px-8 bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center hover:bg-white/20 transition-all">{T.cta_contact}</a>
            </div>
          </div>
        </div>
      </section>
      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
    </>
  );
}
