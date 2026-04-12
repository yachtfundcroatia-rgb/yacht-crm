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
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Asset-Backed Structure",
      description: "Each investment is secured by a specific yacht with a clearly defined market value. Investor interests are protected through a mortgage entry in the Croatian Maritime Register.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: "Legal Structure and Transparency",
      description: "All agreements are executed in written form and notarially certified by both parties, ensuring legal certainty and transparency.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      title: "Insurance Coverage",
      description: "The yacht is comprehensively insured, including accidental damage and loss, third-party liability, and loss of charter income.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "Experienced Operator",
      description: "Fleet operations are handled by one of the largest charter operators in Croatia, with over 30 years of experience and a fleet exceeding 300 yachts. The operator also supports yacht selection to maximize charter profitability.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: "Market Resilience",
      description: "The yacht charter market has demonstrated strong resilience to economic cycles. During the pandemic, demand for private and flexible travel solutions increased significantly, reinforcing long-term market fundamentals.",
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-16 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-[#0a192f] mb-10 flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137fec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Capital Protection &amp; Legal Structure
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                {item.icon}
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
      q: "What is the yacht investment project in Croatia about?",
      a: "The project involves a group investment in modern sailing yachts or catamarans, which are then chartered to tourists in Croatia. Revenue from rentals generates regular returns, which are distributed proportionally among investors.",
    },
    {
      q: "What is the minimum investment threshold?",
      a: "The minimum investment amount is €10,000. You may invest multiples of this amount, thereby increasing your share of returns.",
    },
    {
      q: "What are the projected returns?",
      a: "The potential annual return is up to 12%. Returns depend on the seasonal occupancy of the yacht, which is monitored by a professional charter operator.",
    },
    {
      q: "Who manages the yacht charter operations?",
      a: "Operational charter management is handled by a reputable Croatian operator with over 30 years of experience and a fleet of more than 300 yachts. This ensures investors' assets are managed by professionals.",
    },
    {
      q: "Is the investment safe?",
      a: "Yes. Each investment is legally secured through a mortgage entry on the purchased yacht, meaning the contributed capital is backed by a real, tangible asset.",
    },
    {
      q: "Is the yacht insured?",
      a: "Yes. The yacht is comprehensively insured, covering physical damage, third-party liability, and an additional policy protecting investors against loss of charter income.",
    },
    {
      q: "What is the investment duration?",
      a: "The standard investment term is 72 months (6 seasons). After 24 months, there is an option to exit the investment at no cost through an assignment of rights to another investor.",
    },
    {
      q: "How can I exit the investment early?",
      a: "After 24 months, an investor may use the contract assignment option — transferring their rights and obligations to another investor without additional costs.",
    },
    {
      q: "How are returns calculated and reported?",
      a: "Each investor receives access to an individual online investment panel, where regular rental reports and profit calculations are published relative to their investment share.",
    },
    {
      q: "When are profits paid out?",
      a: "Charter profits are paid out once a year, after the full sailing season ends and revenues are settled by the operator.",
    },
    {
      q: "What is the step-by-step investment process?",
      a: "1. Declaration of investment and payment of a 10% reservation deposit. 2. Once the required funds are collected, the yacht is purchased. 3. Investors sign notarially certified investment agreements and make the full payment. 4. The yacht is handed over to the charter operator. 5. The charter season begins, followed by annual settlements with investors.",
    },
    {
      q: "Where will the yacht be based?",
      a: "The yacht will be based in one of Croatia's popular marinas, ensuring high tourist interest and strong occupancy during the season.",
    },
    {
      q: "Do I sign an investment agreement?",
      a: "Yes. Each investor enters into an investment agreement in the form of a notarial deed, providing additional legal protection for the entire transaction.",
    },
    {
      q: "Do I need to be present in person to sign the agreement?",
      a: "No. It is possible to sign through a proxy, and the entire process can be completed remotely if agreed upon with the project organizers.",
    },
    {
      q: "Can I monitor the yacht's occupancy?",
      a: "Yes. Occupancy data and charter revenues are shared periodically in reports available online, so each investor can monitor investment progress in real time.",
    },
    {
      q: "Who can invest?",
      a: "The project is open to individuals and legal entities with available capital of at least €10,000 who are interested in alternative, income-generating investments backed by real assets.",
    },
    {
      q: "Can I invest from abroad?",
      a: "Yes. The investment is available to individuals from across the European Union and other countries, provided they meet KYC (Know Your Customer) and AML (Anti-Money Laundering) requirements.",
    },
    {
      q: "Can I use the yacht as an investor?",
      a: "At the current stage, the project does not include free use of the yacht by investors. However, special discounts on private rentals may be available to project participants.",
    },
    {
      q: "Can I invest through a company?",
      a: "Yes. You may invest as a private individual or through a capital company. The investment agreement will be adapted accordingly to the investor's legal form.",
    },
    {
      q: "Who is behind the project?",
      a: "The project is led by a team of experienced specialists from the investment and sailing industries. Our goal is to create safe and profitable investment models based on real assets such as charter yachts.",
    },
    {
      q: "How can I get more information?",
      a: "Contact us through the contact form on the website, send an email, or schedule a phone call with our investment advisor.",
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
                <span className="font-bold text-[#0a192f] pr-4 text-sm">{faq.q}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
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
            <div className="flex gap-4 justify-center flex-wrap">
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
