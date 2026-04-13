"use client";

import { useState } from "react";
import Link from "next/link";
import InvestModal from "./InvestModal";
import CallModal from "./CallModal";
import { useLang } from "@/lib/LanguageContext";
import { t, Lang } from "@/lib/translations";

const LOGO_URL = "https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/YACHT%20FUND%20blue%20main%20.png";

export default function SiteHeader() {
  const { lang, setLang } = useLang();
  const T = t[lang].nav;
  const [investOpen, setInvestOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-6 lg:px-20 py-3">
          <Link href="/" className="flex items-center no-underline flex-shrink-0">
            <img src={LOGO_URL} alt="Yacht Fund" className="h-9 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/how-it-works" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">{T.how_it_works}</Link>
            <Link href="/investments" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">{T.investments}</Link>
            <Link href="/security" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">{T.security}</Link>
            <Link href="/about" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">{T.about}</Link>
            <Link href="/contact" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">{T.contact}</Link>
            <div className="flex items-center gap-1 text-xs font-bold border-l border-slate-300 pl-6">
              {(["en", "pl", "hr"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span className="text-slate-300 mx-1">/</span>}
                  <button
                    onClick={() => setLang(l)}
                    className={`transition-colors ${lang === l ? "text-[#137fec] font-black" : "text-slate-500 hover:text-[#137fec]"}`}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex gap-3">
            <button
              onClick={() => setInvestOpen(true)}
              className="min-w-[100px] rounded-lg h-10 px-5 bg-[#137fec] text-white text-sm font-bold shadow-md hover:bg-[#0f6fd4] transition-all"
            >
              {T.invest_now}
            </button>
            <button
              onClick={() => setCallOpen(true)}
              className="min-w-[100px] rounded-lg h-10 px-5 border-2 border-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all"
            >
              {T.book_call}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a192f" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a192f" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
            <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] py-2.5 border-b border-gray-50">{T.how_it_works}</Link>
            <Link href="/investments" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] py-2.5 border-b border-gray-50">{T.investments}</Link>
            <Link href="/security" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] py-2.5 border-b border-gray-50">{T.security}</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] py-2.5 border-b border-gray-50">{T.about}</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] py-2.5 border-b border-gray-50">{T.contact}</Link>
            <div className="flex items-center gap-2 py-2 border-b border-gray-50">
              {(["en", "pl", "hr"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span className="text-slate-300 mx-1">/</span>}
                  <button
                    onClick={() => { setLang(l); setMobileOpen(false); }}
                    className={`text-xs font-bold transition-colors ${lang === l ? "text-[#137fec]" : "text-slate-500"}`}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-3 pt-3">
              <button onClick={() => { setInvestOpen(true); setMobileOpen(false); }} className="flex-1 rounded-lg h-11 px-4 bg-[#137fec] text-white text-sm font-bold hover:bg-[#0f6fd4] transition-all">{T.invest_now}</button>
              <button onClick={() => { setCallOpen(true); setMobileOpen(false); }} className="flex-1 rounded-lg h-11 px-4 border-2 border-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all">{T.book_call}</button>
            </div>
          </div>
        )}
      </header>

      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
