"use client";

import { useState } from "react";
import Link from "next/link";
import InvestModal from "./InvestModal";
import CallModal from "./CallModal";

const LOGO_URL = "https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/YACHT%20FUND%20blue%20main%20.png";

export default function SiteHeader() {
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
            <Link href="/how-it-works" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">How it Works</Link>
            <Link href="/investments" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">Investments</Link>
            <Link href="/security" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">Security & FAQ</Link>
            <Link href="/about" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">About</Link>
            <Link href="/contact" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">Contact</Link>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-bold border-l border-slate-300 pl-6">
              <span>EN</span><span className="text-slate-300 mx-1">/</span><span>HR</span>
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex gap-3">
            <button
              onClick={() => setInvestOpen(true)}
              className="min-w-[100px] rounded-lg h-10 px-5 bg-[#137fec] text-white text-sm font-bold shadow-md hover:bg-[#0f6fd4] transition-all"
            >
              Invest Now
            </button>
            <button
              onClick={() => setCallOpen(true)}
              className="min-w-[100px] rounded-lg h-10 px-5 border-2 border-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all"
            >
              Book a Call
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
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a192f" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
            <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors py-2.5 border-b border-gray-50">How it Works</Link>
            <Link href="/investments" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors py-2.5 border-b border-gray-50">Investments</Link>
            <Link href="/security" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors py-2.5 border-b border-gray-50">Security & FAQ</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors py-2.5 border-b border-gray-50">About</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors py-2.5 border-b border-gray-50">Contact</Link>
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => { setInvestOpen(true); setMobileOpen(false); }}
                className="flex-1 rounded-lg h-11 px-4 bg-[#137fec] text-white text-sm font-bold hover:bg-[#0f6fd4] transition-all"
              >
                Invest Now
              </button>
              <button
                onClick={() => { setCallOpen(true); setMobileOpen(false); }}
                className="flex-1 rounded-lg h-11 px-4 border-2 border-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all"
              >
                Book a Call
              </button>
            </div>
          </div>
        )}
      </header>

      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
