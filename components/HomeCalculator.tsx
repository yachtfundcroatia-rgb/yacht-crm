"use client";

import { useState } from "react";
import InvestModal from "./InvestModal";

export default function HomeCalculator() {
  const [investment, setInvestment] = useState(100000);
  const [investOpen, setInvestOpen] = useState(false);

  const targetReturn = 0.12;
  const annualYield = investment * targetReturn;
  const monthlyPayout = annualYield / 12;

  return (
    <>
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-[#0a192f] mb-6">
              Project Your Earnings
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Our Yacht Fund targets a consistent 12% annual net return for our partners. Use our interactive tool to see how your investment can grow over time in the thriving Croatian charter market.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Target Return</div>
                <div className="text-3xl font-black text-[#137fec]">12.0%</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Minimum Unit</div>
                <div className="text-3xl font-black text-[#0a192f]">€10,000</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#137fec] text-xl">⊞</span>
              <span className="font-bold text-[#0a192f]">Profitability Calculator</span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Investment Amount (€)</label>
                <span className="text-2xl font-black text-[#137fec]">€{investment.toLocaleString()}</span>
              </div>
              <input
                type="range" min="10000" max="500000" step="10000"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#137fec]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>€10k</span><span>€500k</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Annual Yield</div>
                <div className="text-2xl font-black text-[#137fec]">
                  €{annualYield.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Monthly Payout</div>
                <div className="text-2xl font-black text-[#137fec]">
                  €{monthlyPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setInvestOpen(true)}
              className="w-full py-4 bg-[#0a192f] text-white rounded-xl font-bold hover:bg-[#0f2848] transition-colors flex items-center justify-center gap-2"
            >
              Get Detailed Proposal →
            </button>
          </div>
        </div>
      </section>

      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
    </>
  );
}