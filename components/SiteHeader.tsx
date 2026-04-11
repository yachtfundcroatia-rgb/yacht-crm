"use client";

import { useState } from "react";
import Link from "next/link";
import InvestModal from "./InvestModal";
import CallModal from "./CallModal";

export default function SiteHeader() {
  const [investOpen, setInvestOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-20 py-4">
        <Link href="/" className="flex items-center gap-3 text-[#0a192f] no-underline">
          <span className="text-2xl">⛵</span>
          <span className="text-xl font-black tracking-tight uppercase">Yacht Fund</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/how-it-works" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">How it Works</Link>
          <Link href="/investments" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">Investments</Link>
          <Link href="/security" className="text-slate-700 text-sm font-semibold hover:text-[#137fec] transition-colors">Security & FAQ</Link>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold border-l border-slate-300 pl-8">
            <span>EN</span><span className="text-slate-300 mx-1">/</span><span>HR</span>
          </div>
        </nav>

        <div className="flex gap-3">
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
      </header>

      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}