"use client";

import { useState } from "react";
import InvestModal from "./InvestModal";
import CallModal from "./CallModal";

export default function HomeHero() {
  const [investOpen, setInvestOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);

  return (
    <>
      <section className="relative px-6 lg:px-20 py-10 lg:py-16">
        <div
          className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center rounded-2xl items-center justify-center p-8 text-center relative overflow-hidden shadow-2xl"
          style={{
            backgroundImage: "linear-gradient(rgba(10,25,47,0.70) 0%, rgba(10,25,47,0.50) 100%), url(https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/s-m-A4Pzp82JHK8-unsplash.jpg)",
          }}
        >
          <div className="z-10 max-w-5xl flex flex-col items-center gap-4">

            {/* Level 1 — main headline, one line, biggest */}
            <h1 className="text-white text-5xl lg:text-7xl font-black leading-none tracking-tight whitespace-nowrap">
              Steady Returns
            </h1>

            {/* Level 2 — subtitle, one line, smaller */}
            <h2 className="text-white/90 text-2xl lg:text-3xl font-bold leading-snug">
              From Professional Yacht Charter Investment
            </h2>

            {/* Level 3 — two lines description */}
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-slate-300 text-base lg:text-lg font-medium leading-relaxed">
                Secure your capital in luxury yacht charters in the stunning waters of Croatia.
              </p>
              <p className="text-slate-300 text-base lg:text-lg font-medium leading-relaxed">
                High-yield nautical opportunities with professional management.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button
                onClick={() => setInvestOpen(true)}
                className="min-w-[160px] rounded-xl h-14 px-8 bg-[#137fec] text-white text-lg font-bold shadow-lg hover:bg-[#0f6fd4] transition-colors"
              >
                Invest Now
              </button>
              <button
                onClick={() => setCallOpen(true)}
                className="min-w-[160px] rounded-xl h-14 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all"
              >
                Book a Call
              </button>
            </div>
          </div>
        </div>
      </section>

      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
