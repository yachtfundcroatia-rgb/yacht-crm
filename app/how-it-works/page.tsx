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
        <BusinessModel />
        <InvestorJourney />
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
          high-performance assets and distribute consistent monthly dividends to our global community of partners.
        </p>
      </div>
    </section>
  );
}

function BusinessModel() {
  const steps = [
    {
      num: "01",
      title: "Asset Acquisition",
      description: "Our expert brokerage team identifies and purchases high-yield luxury yachts at strategic market prices, utilizing rigorous 120-point nautical inspections and market analysis.",
    },
    {
      num: "02",
      title: "Charter Management",
      description: "Professional crews and shore teams manage day-to-day operations, maintenance, and booking schedules through our global partner networks to maximize year-round charter revenue.",
    },
    {
      num: "03",
      title: "Dividend Distribution",
      description: "Net profits from charter operations are distributed as monthly dividends directly to our community of investors. All performance data is visible via your real-time dashboard.",
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-20 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-2">Our 3-Step Business Model</h2>
        <div className="w-16 h-1 bg-[#137fec] mb-12"></div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-[#137fec]">
                  {step.num}
                </div>
                <span className="text-4xl font-black text-gray-100">{step.num}</span>
              </div>
              <h3 className="text-xl font-black text-[#0a192f] mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorJourney() {
  const steps = [
    {
      title: "Join the Fund",
      description: "Complete our KYC verification process and gain immediate access to our investor dashboard and current fleet opportunities.",
    },
    {
      title: "Allocate Capital",
      description: "Choose your preferred investment tier and fund your secure account. Your capital is immediately deployed into our active maritime asset pool.",
    },
    {
      title: "Receive Returns",
      description: "Monitor real-time vessel performance and booking rates. Receive your proportionate share of quarterly earnings directly to your wallet.",
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#0a192f] mb-12">The Investor Journey</h2>
        <div className="max-w-3xl">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#137fec] rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-16 bg-blue-100 mt-2 mb-2"></div>
                )}
              </div>
              <div className="pb-12">
                <h3 className="text-xl font-black text-[#0a192f] mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
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
    <section className="px-6 lg:px-20 py-16">
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
              className="min-w-[160px] rounded-xl h-14 px-8 bg-[#137fec] text-white font-bold hover:bg-[#0f6fd4] transition-colors"
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
      <InvestModal open={investOpen} onClose={() => setInvestOpen(false)} />
    </section>
  );
}
