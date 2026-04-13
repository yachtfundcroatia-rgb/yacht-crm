"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InvestModal from "@/components/InvestModal";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <SiteHeader />
      <main>
        <HowItWorksHero />
        <InvestmentModel />
        <ProjectedReturns />
        <CaseStudy />
        <StepByStep />
        <HowItWorksCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

function HowItWorksHero() {
  const { lang } = useLang();
  const T = t[lang].hiw;
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

function InvestmentModel() {
  const { lang } = useLang();
  const T = t[lang].hiw;
  const icons = [
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  ];
  const models = [
    { title: T.model1_title, desc: T.model1_desc },
    { title: T.model2_title, desc: T.model2_desc },
    { title: T.model3_title, desc: T.model3_desc },
  ];
  return (
    <section className="px-6 lg:px-20 py-20 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">{T.model_title}</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-12"></div>
        <div className="grid md:grid-cols-3 gap-8">
          {models.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">{icons[i]}</div>
              <h3 className="text-lg font-black text-[#0a192f] mb-3">{m.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectedReturns() {
  const { lang } = useLang();
  const T = t[lang].hiw;
  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl font-black text-[#0a192f] mb-2">{T.returns_title}</h2>
          <div className="w-16 h-1 bg-[#137fec] mb-8"></div>
          <p className="text-gray-600 leading-relaxed mb-6">{T.returns_p}</p>
          <ul className="space-y-3">
            {T.costs.map((cost, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#137fec]"></div>
                </div>
                <span className="text-gray-600 text-sm leading-relaxed">{cost}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#f8faff] rounded-2xl p-8 border border-blue-50 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h3 className="font-black text-[#0a192f]">{T.returns_data_title}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{T.returns_data_p}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-black text-[#137fec] mb-1">12%</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{T.returns_stat1}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-black text-[#0a192f] mb-1">{T.returns_stat2_val}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{T.returns_stat2}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  const { lang } = useLang();
  const T = t[lang].hiw;
  return (
    <section className="px-6 lg:px-20 py-20 bg-[#0a192f]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-white mb-2">{T.case_title}</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-10"></div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Lagoon 42 (2021)</h3>
              <span className="text-xs font-bold text-[#137fec] bg-blue-900/40 px-3 py-1 rounded-full">Active Fleet</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{ label: "Purchase Price", val: "€500,000" }, { label: "Annual Revenue", val: "€117,975" }, { label: "Net Yield", val: "12%" }].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
                  <div className={`text-lg font-black ${s.label === "Net Yield" ? "text-green-400" : "text-[#137fec]"}`}>{s.val}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Average Charter Rates — Lagoon 42</div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10"><th className="text-left text-gray-400 font-semibold pb-2">Year</th><th className="text-right text-gray-400 font-semibold pb-2">Peak</th><th className="text-right text-gray-400 font-semibold pb-2">Avg</th></tr></thead>
                <tbody className="text-white">
                  {[["2020","€8,214","€4,094"],["2021","€8,181","€4,216"],["2022","€8,791","€4,326"],["2023","€9,083","€4,719"]].map(([y,p,a]) => (
                    <tr key={y} className="border-b border-white/5"><td className="py-2 text-gray-300">{y}</td><td className="py-2 text-right text-[#137fec] font-semibold">{p}</td><td className="py-2 text-right text-[#137fec] font-semibold">{a}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Booking Rate — Lagoon 42</div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10"><th className="text-left text-gray-400 font-semibold pb-2">Year</th><th className="text-right text-gray-400 font-semibold pb-2">Peak</th><th className="text-right text-gray-400 font-semibold pb-2">Avg</th><th className="text-right text-gray-400 font-semibold pb-2">Weeks</th></tr></thead>
                <tbody className="text-white">
                  {[["2022","97.62%","45.18%","23"],["2023","93.94%","50.07%","26"],["2024","96.77%","52.61%","27"]].map(([y,p,a,w]) => (
                    <tr key={y} className="border-b border-white/5"><td className="py-2 text-gray-300">{y}</td><td className="py-2 text-right text-green-400 font-semibold">{p}</td><td className="py-2 text-right text-green-400 font-semibold">{a}</td><td className="py-2 text-right text-white font-semibold">{w}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">SunReef 50 (2021)</h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-900/40 px-3 py-1 rounded-full">Premium Tier</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{ label: "Purchase Price", val: "€2,592,000" }, { label: "Annual Revenue", val: "€915,000" }, { label: "Net Yield", val: "17%" }].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
                  <div className={`text-lg font-black ${s.label === "Net Yield" ? "text-green-400" : "text-[#137fec]"}`}>{s.val}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Average Charter Rates — SunReef 50</div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10"><th className="text-left text-gray-400 font-semibold pb-2">Year</th><th className="text-right text-gray-400 font-semibold pb-2">Peak</th><th className="text-right text-gray-400 font-semibold pb-2">Avg</th></tr></thead>
                <tbody className="text-white">
                  {[["2020","€26,820","€16,755"],["2021","€26,660","€16,164"],["2022","€29,000","€19,178"],["2023","€30,500","€20,765"]].map(([y,p,a]) => (
                    <tr key={y} className="border-b border-white/5"><td className="py-2 text-gray-300">{y}</td><td className="py-2 text-right text-[#137fec] font-semibold">{p}</td><td className="py-2 text-right text-[#137fec] font-semibold">{a}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Booking Rate — SunReef 50</div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10"><th className="text-left text-gray-400 font-semibold pb-2">Year</th><th className="text-right text-gray-400 font-semibold pb-2">Peak</th><th className="text-right text-gray-400 font-semibold pb-2">Avg</th><th className="text-right text-gray-400 font-semibold pb-2">Weeks</th></tr></thead>
                <tbody className="text-white">
                  {[["2022","100%","42.31%","22"],["2023","100%","59.48%","30"]].map(([y,p,a,w]) => (
                    <tr key={y} className="border-b border-white/5"><td className="py-2 text-gray-300">{y}</td><td className="py-2 text-right text-green-400 font-semibold">{p}</td><td className="py-2 text-right text-green-400 font-semibold">{a}</td><td className="py-2 text-right text-white font-semibold">{w}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">Source: www.yacht-rent.com/yacht-charter-statistics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepByStep() {
  const { lang } = useLang();
  const T = t[lang].hiw;
  const steps = [
    { title: T.step1_title, desc: T.step1_desc },
    { title: T.step2_title, desc: T.step2_desc },
    { title: T.step3_title, desc: T.step3_desc },
    { title: T.step4_title, desc: T.step4_desc },
  ];
  return (
    <section className="px-6 lg:px-20 py-20 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">{T.steps_title}</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-12"></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative">
              <div className="w-12 h-12 bg-[#137fec] rounded-xl flex items-center justify-center text-white font-black text-xl mb-5">{i + 1}</div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 right-0 translate-x-1/2 z-10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              )}
              <h3 className="text-lg font-black text-[#0a192f] mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksCTA() {
  const { lang } = useLang();
  const T = t[lang].hiw;
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
              <a href="/investments" className="min-w-[160px] rounded-xl h-14 px-8 bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center hover:bg-white/20 transition-all">{T.cta_fleet}</a>
            </div>
          </div>
        </div>
      </section>
      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
    </>
  );
}
