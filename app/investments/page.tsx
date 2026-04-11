"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InvestModal from "@/components/InvestModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Investment {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url: string;
  target_roi: number;
  min_investment: number;
  total_slots: number;
  available_slots: number;
  vessel_year: number;
  vessel_length: string;
  vessel_cabins: number;
  status: string;
  currency: string;
}

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <SiteHeader />
      <main>
        <InvestmentsHero />
        <InvestmentsList />
        <InvestmentsStats />
      </main>
      <SiteFooter />
    </div>
  );
}

function InvestmentsHero() {
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-black text-[#0a192f] mb-6">
          Active &amp; Upcoming Investments
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          Fractional ownership opportunities in premium luxury yacht assets.
          Secure your slot in the world&apos;s most exclusive charter fleet.
        </p>
      </div>
    </section>
  );
}

function InvestmentsList() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "upcoming">("all");
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [investOpen, setInvestOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/public/investments`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInvestments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = investments.filter((inv) => {
    if (filter === "active") return inv.status === "fundraising" || inv.status === "active";
    if (filter === "upcoming") return inv.status === "upcoming" || inv.status === "coming_soon";
    return true;
  });

  const handleInvest = (inv: Investment) => {
    setSelectedInvestment(inv);
    setInvestOpen(true);
  };

  return (
    <section className="px-6 lg:px-20 py-16 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 mb-10">
          {(["all", "active", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors capitalize ${
                filter === f
                  ? "bg-[#0a192f] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {f === "all" ? "All Assets" : f === "active" ? "Active" : "Upcoming"}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400">Loading investments...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">No investments found.</div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((inv) => {
            const isActive = inv.status === "fundraising" || inv.status === "active";
            const slotsPercent = inv.total_slots
              ? Math.round(((inv.total_slots - inv.available_slots) / inv.total_slots) * 100)
              : 0;

            return (
              <div
                key={inv.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${!isActive ? "opacity-70" : ""}`}
              >
                <div className="relative h-52 bg-cover bg-center" style={{ backgroundImage: `url(${inv.image_url})` }}>
                  <div className={`absolute top-4 left-4 px-3 py-1 text-white text-xs font-black rounded-full uppercase tracking-wide ${isActive ? "bg-green-500" : "bg-gray-600"}`}>
                    {isActive ? "Active Now" : "Coming Soon"}
                  </div>
                  {inv.id && (
                    <div className="absolute bottom-4 left-4">
                      <div className="text-white/60 text-xs">Ref: {inv.id}</div>
                      <div className="text-white font-black text-lg">{inv.name}</div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                    {inv.vessel_year && (
                      <div>
                        <div className="text-gray-400 text-xs">Build</div>
                        <div className="font-bold text-[#0a192f]">{inv.vessel_year}</div>
                      </div>
                    )}
                    {inv.vessel_length && (
                      <div>
                        <div className="text-gray-400 text-xs">Length</div>
                        <div className="font-bold text-[#0a192f]">{inv.vessel_length}</div>
                      </div>
                    )}
                    {inv.vessel_cabins && (
                      <div>
                        <div className="text-gray-400 text-xs">Cabins</div>
                        <div className="font-bold text-[#0a192f]">{inv.vessel_cabins}</div>
                      </div>
                    )}
                  </div>

                  {isActive && inv.total_slots > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Available Slots</span>
                        <span className="font-bold text-[#137fec]">{inv.available_slots} / {inv.total_slots} Remaining</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-1.5 bg-[#137fec] rounded-full"
                          style={{ width: `${slotsPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-5">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Projected Yield</div>
                    <div className="text-2xl font-black text-[#137fec]">{inv.target_roi}%</div>
                  </div>

                  {isActive ? (
                    <button
                      onClick={() => handleInvest(inv)}
                      className="w-full py-3 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors"
                    >
                      View Details
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-center text-sm">
                      Est. Investment: {inv.currency} {Number(inv.min_investment).toLocaleString()} / Slot
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <InvestModal
        open={investOpen}
        onClose={() => { setInvestOpen(false); setSelectedInvestment(null); }}
        defaultAmount={selectedInvestment?.min_investment?.toString() || ""}
      />
    </section>
  );
}

function InvestmentsStats() {
  const stats = [
    { value: "24", label: "Managed Vessels" },
    { value: "€42M", label: "Assets Under Management" },
    { value: "11.4%", label: "Avg. Annual Return" },
    { value: "1,200+", label: "Active Investors" },
  ];

  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-black text-[#137fec] mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
