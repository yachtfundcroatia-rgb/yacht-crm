"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CallModal from "@/components/CallModal";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <SiteHeader />
      <main>
        <SecurityHero />
        <CapitalProtection />
        <SecurityPoints />
        <FAQSection />
        <SecurityCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

function SecurityHero() {
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-black text-[#0a192f] mb-6">
          Investment Security &amp; FAQ
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          Institutional-grade asset protection. Learn how we secure your capital through physical
          asset backing, Croatian legal trusts, and comprehensive maritime insurance.
        </p>
      </div>
    </section>
  );
}

function CapitalProtection() {
  const items = [
    {
      title: "Asset-Backed Security",
      description: "Your investment is directly secured by a diverse fleet of luxury yachts. Every euro is backed by physical assets with quarterly independent valuations.",
    },
    {
      title: "Croatian Legal Trust",
      description: "Assets are held within a regulated Special Purpose Vehicle (SPV) compliant with EU and Croatian maritime law, ensuring clear ownership rights.",
    },
    {
      title: "Comprehensive Insurance",
      description: "All vessels carry full Lloyd's of London hull and machinery coverage, plus high-limit third-party liability and charter loss-of-rent protection.",
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-16 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-[#0a192f] mb-10 flex items-center gap-3">
          <span className="text-[#137fec]">🛡</span>
          Capital Protection &amp; Legal Structure
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {items.map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-[#137fec]">
                🛡
              </div>
              <h3 className="font-black text-[#0a192f] mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityPoints() {
  const points = [
    "Annual independent audits by Tier-1 firms",
    "Escrow-based capital deployment protocols",
    "Legal oversight by leading Adriatic maritime counsel",
    "Real-time performance transparency dashboard",
  ];

  return (
    <section className="px-6 lg:px-20 py-8 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {points.map((point) => (
            <div key={point} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-[#137fec] rounded-full"></div>
              </div>
              <span className="text-gray-700 font-medium">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the minimum investment requirement?",
      a: "The minimum initial investment for our Yacht Charter Fund is €25,000. Subsequent investments can be made in increments of €5,000. We also offer institutional share classes for investments exceeding €500,000.",
    },
    {
      q: "How and when are returns distributed?",
      a: "Distributions are paid out semi-annually. Yields are generated from charter income throughout the Mediterranean sailing season (May-October). Investors can choose to have distributions paid to their bank account or automatically reinvested into the fund.",
    },
    {
      q: "What is the typical investment horizon?",
      a: "While there is no fixed lock-up period, we recommend a medium to long-term horizon of 3-5 years to fully benefit from the yacht's operational lifecycle and market appreciation. Redemption requests are processed quarterly with a 90-day notice period.",
    },
    {
      q: "How are the yachts managed and maintained?",
      a: "All yachts are professionally managed by our in-house maritime team based in Split, Croatia. We handle all staffing, winter maintenance, charter bookings, and technical servicing to ensure the assets retain their value and remain in pristine condition.",
    },
    {
      q: "What happens if the charter season is poor?",
      a: "The fund maintains a cash reserve to cover operational expenses during off-peak or below-average seasons. Additionally, our insurance policy includes Loss of Charter coverage for mechanical breakdowns or other unforeseen interruptions to revenue.",
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center text-[#0a192f] mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Everything you need to know about the fund, returns, and liquidity.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#f6f7f8] rounded-xl overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <span className="font-bold text-[#0a192f] pr-4">{faq.q}</span>
                <span className={`text-gray-400 text-xl transition-transform flex-shrink-0 ${open === i ? "rotate-180" : ""}`}>
                  ∨
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityCTA() {
  const [callOpen, setCallOpen] = useState(false);

  return (
    <>
      <section className="px-6 lg:px-20 py-16 bg-[#f6f7f8]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#137fec] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-black text-white mb-3">Still have questions?</h2>
            <p className="text-blue-100 mb-8">
              Our investment specialists are ready to help you understand the fund structure in detail.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCallOpen(true)}
                className="px-8 py-3 bg-white text-[#137fec] rounded-xl font-bold hover:bg-blue-50 transition-colors"
              >
                Schedule a Call
              </button>
              <a
                href="mailto:invest@yachtfund.com"
                className="px-8 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
