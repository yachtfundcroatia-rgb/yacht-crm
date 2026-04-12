"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InvestModal from "@/components/InvestModal";

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
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
          <span className="text-[#137fec] text-xs font-black uppercase tracking-widest">
            Secure Investment Model
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-[#0a192f] mb-6 max-w-3xl">
          Investment Process: How It Works
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          A transparent, professional guide to our yacht charter investment model. Learn how we acquire
          high-performance assets and distribute consistent annual returns to our community of partners.
        </p>
      </div>
    </section>
  );
}

function InvestmentModel() {
  return (
    <section className="px-6 lg:px-20 py-20 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">The Investment Model</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-10"></div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3 className="text-lg font-black text-[#0a192f] mb-3">Capital Allocation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Yacht Fund enables investors to provide capital for consideration to acquire a specific yacht intended for professional charter operations. Each investment is based on a tangible, income-generating asset — a yacht operating on the Croatian charter market.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className="text-lg font-black text-[#0a192f] mb-3">Charter Operations</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Investor capital is allocated exclusively to the purchase of the yacht. Once acquired, the yacht is handed over to an experienced charter operator responsible for full operational management and revenue optimization.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3 className="text-lg font-black text-[#0a192f] mb-3">Return Distribution</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Investor returns are generated from charter income and distributed proportionally to the contributed capital.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectedReturns() {
  const costs = [
    "Marina and port fees",
    "Technical service and maintenance",
    "Yacht and business insurance",
    "Charter sales and distribution costs (platforms, agents, sales channels)",
    "Handover and redelivery costs",
    "Cleaning and full operational support",
  ];

  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl font-black text-[#0a192f] mb-2">Projected Returns</h2>
          <div className="w-16 h-1 bg-[#137fec] mb-8"></div>
          <p className="text-gray-600 leading-relaxed mb-6">
            The projected annual return of <strong className="text-[#0a192f]">up to 12%</strong> is a net figure, calculated after deducting all operational costs, including:
          </p>
          <ul className="space-y-3">
            {costs.map((cost) => (
              <li key={cost} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#137fec]"></div>
                </div>
                <span className="text-gray-600 text-sm leading-relaxed">{cost}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#f6f7f8] rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h3 className="font-black text-[#0a192f]">Data-Backed Projections</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Projections are based on historical charter performance data from recent years, provided by both the operating charter company and independent global charter market research firms.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-black text-[#137fec] mb-1">12%</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Target Net Return</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-black text-[#0a192f] mb-1">6 yr</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Investment Term</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  return (
    <section className="px-6 lg:px-20 py-20 bg-[#0a192f]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-white mb-2">Case Study</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-10"></div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lagoon 42 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Lagoon 42 (2021)</h3>
              <span className="text-xs font-bold text-[#137fec] bg-blue-900/40 px-3 py-1 rounded-full">Active Fleet</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Purchase Price</div>
                <div className="text-lg font-black text-[#137fec]">€500,000</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Annual Revenue</div>
                <div className="text-lg font-black text-[#137fec]">€117,975</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Net Yield</div>
                <div className="text-lg font-black text-green-400">12%</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                Average Charter Rates — Lagoon 42 in Croatia
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 font-semibold pb-2">Year</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Peak</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Average</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {[
                    { year: "2020", peak: "€8,214", avg: "€4,094" },
                    { year: "2021", peak: "€8,181", avg: "€4,216" },
                    { year: "2022", peak: "€8,791", avg: "€4,326" },
                    { year: "2023", peak: "€9,083", avg: "€4,719" },
                  ].map((row) => (
                    <tr key={row.year} className="border-b border-white/5">
                      <td className="py-2 text-gray-300">{row.year}</td>
                      <td className="py-2 text-right text-[#137fec] font-semibold">{row.peak}</td>
                      <td className="py-2 text-right text-[#137fec] font-semibold">{row.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                Average Booking Rate — Lagoon 42
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 font-semibold pb-2">Year</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Peak</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Average</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Weeks</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {[
                    { year: "2022", peak: "97.62%", avg: "45.18%", weeks: "23" },
                    { year: "2023", peak: "93.94%", avg: "50.07%", weeks: "26" },
                    { year: "2024", peak: "96.77%", avg: "52.61%", weeks: "27" },
                  ].map((row) => (
                    <tr key={row.year} className="border-b border-white/5">
                      <td className="py-2 text-gray-300">{row.year}</td>
                      <td className="py-2 text-right text-green-400 font-semibold">{row.peak}</td>
                      <td className="py-2 text-right text-green-400 font-semibold">{row.avg}</td>
                      <td className="py-2 text-right text-white font-semibold">{row.weeks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SunReef 50 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">SunReef 50 (2021)</h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-900/40 px-3 py-1 rounded-full">Premium Tier</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Purchase Price</div>
                <div className="text-lg font-black text-[#137fec]">€2,592,000</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Annual Revenue</div>
                <div className="text-lg font-black text-[#137fec]">€915,000</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Net Yield</div>
                <div className="text-lg font-black text-green-400">17%</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                Average Charter Rates — SunReef 50 in Croatia
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 font-semibold pb-2">Year</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Peak</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Average</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {[
                    { year: "2020", peak: "€26,820", avg: "€16,755" },
                    { year: "2021", peak: "€26,660", avg: "€16,164" },
                    { year: "2022", peak: "€29,000", avg: "€19,178" },
                    { year: "2023", peak: "€30,500", avg: "€20,765" },
                  ].map((row) => (
                    <tr key={row.year} className="border-b border-white/5">
                      <td className="py-2 text-gray-300">{row.year}</td>
                      <td className="py-2 text-right text-[#137fec] font-semibold">{row.peak}</td>
                      <td className="py-2 text-right text-[#137fec] font-semibold">{row.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                Average Booking Rate — SunReef 50
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 font-semibold pb-2">Year</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Peak</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Average</th>
                    <th className="text-right text-gray-400 font-semibold pb-2">Weeks</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {[
                    { year: "2022", peak: "100%", avg: "42.31%", weeks: "22" },
                    { year: "2023", peak: "100%", avg: "59.48%", weeks: "30" },
                  ].map((row) => (
                    <tr key={row.year} className="border-b border-white/5">
                      <td className="py-2 text-gray-300">{row.year}</td>
                      <td className="py-2 text-right text-green-400 font-semibold">{row.peak}</td>
                      <td className="py-2 text-right text-green-400 font-semibold">{row.avg}</td>
                      <td className="py-2 text-right text-white font-semibold">{row.weeks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Source: www.yacht-rent.com/yacht-charter-statistics
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepByStep() {
  const steps = [
    {
      num: "1",
      title: "Reserve Your Slot",
      description: "Reserve your investment slot and pay a reservation deposit.",
    },
    {
      num: "2",
      title: "Sign the Agreement",
      description: "Once all slots are filled, the investment agreement is executed and the remaining capital is contributed.",
    },
    {
      num: "3",
      title: "Yacht Acquisition",
      description: "The company acquires the yacht and assigns it to the charter operator for full management.",
    },
    {
      num: "4",
      title: "Receive Passive Income",
      description: "You receive passive income generated from charter operations, without operational involvement.",
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-20 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">Step by Step</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-12"></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative">
              <div className="w-12 h-12 bg-[#137fec] rounded-xl flex items-center justify-center text-white font-black text-xl mb-5">
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 right-0 translate-x-1/2 z-10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-black text-[#0a192f] mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksCTA() {
  const [investOpen, setInvestOpen] = useState(false);

  return (
    <>
      <section className="px-6 lg:px-20 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a192f] rounded-2xl p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-black text-white mb-3">
                Ready to embark on your investment?
              </h2>
              <p className="text-slate-300">
                Join investors already earning passive income through the global yacht charter market.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <button
                onClick={() => setInvestOpen(true)}
                className="min-w-[160px] rounded-xl h-14 px-8 bg-[#137fec] text-white font-bold flex items-center justify-center hover:bg-[#0f6fd4] transition-colors"
              >
                Start Investing Now
              </button>
              <a
                href="/investments"
                className="min-w-[160px] rounded-xl h-14 px-8 bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center hover:bg-white/20 transition-all"
              >
                View Fleet
              </a>
            </div>
          </div>
        </div>
      </section>
      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
    </>
  );
}
