"use client";

import { useState, useEffect, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InvestModal from "@/components/InvestModal";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

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

function useCountUpOnce(target: number, duration: number = 1200) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let frame: number;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);
  return { value, ref };
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
  const { lang } = useLang();
  const T = t[lang].inv;
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-black text-[#0a192f] mb-6">{T.h1}</h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">{T.p}</p>
      </div>
    </section>
  );
}

function InvestmentCard({ inv, onInvest }: { inv: Investment; onInvest: (inv: Investment) => void }) {
  const { lang } = useLang();
  const T = t[lang].inv;
  const [modalOpen, setModalOpen] = useState(false);
  const isActive = inv.status === "fundraising" || inv.status === "active";
  const slotsPercent = inv.total_slots ? Math.round(((inv.total_slots - inv.available_slots) / inv.total_slots) * 100) : 0;

  return (
    <>
      <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col ${!isActive ? "opacity-60 grayscale" : ""}`}>
        <div className="relative h-52 bg-cover bg-center" style={{ backgroundImage: `url(${inv.image_url})` }}>
          <div className={`absolute top-4 left-4 px-3 py-1 text-white text-xs font-black rounded-full uppercase tracking-wide ${isActive ? "bg-green-500" : "bg-gray-500"}`}>
            {isActive ? T.badge_active : T.badge_coming}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-black text-[#0a192f] mb-1">{inv.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{inv.location}</p>
          <div className="grid grid-cols-3 gap-3 text-sm mb-4">
            {inv.vessel_year && <div><div className="text-gray-400 text-xs mb-0.5">{T.label_build}</div><div className="font-bold text-[#0a192f]">{inv.vessel_year}</div></div>}
            {inv.vessel_length && <div><div className="text-gray-400 text-xs mb-0.5">{T.label_length}</div><div className="font-bold text-[#0a192f]">{inv.vessel_length}</div></div>}
            {inv.vessel_cabins && <div><div className="text-gray-400 text-xs mb-0.5">{T.label_cabins}</div><div className="font-bold text-[#0a192f]">{inv.vessel_cabins}</div></div>}
          </div>
          {isActive && inv.total_slots > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{T.label_slots}</span>
                <span className="font-bold text-[#137fec]">{inv.available_slots} / {inv.total_slots} {T.label_remaining}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-1.5 bg-[#137fec] rounded-full" style={{ width: `${slotsPercent}%` }} /></div>
            </div>
          )}
          <div className="mb-5 mt-auto">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{T.label_yield}</div>
            <div className="text-2xl font-black text-[#137fec]">{inv.target_roi}%</div>
          </div>
          {isActive ? (
            <div className="flex gap-2">
              <button onClick={() => setModalOpen(true)} className="flex-1 py-3 border-2 border-[#137fec] text-[#137fec] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">{T.btn_details}</button>
              <button onClick={() => onInvest(inv)} className="flex-1 py-3 bg-[#137fec] text-white rounded-xl font-bold text-sm hover:bg-[#0f6fd4] transition-colors">{T.btn_invest}</button>
            </div>
          ) : (
            <div className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-center text-sm">
              {T.modal_min}: {inv.currency} {Number(inv.min_investment).toLocaleString()} / Slot
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-3xl font-light leading-none z-10">×</button>
            <div className="h-64 bg-cover bg-center rounded-t-2xl" style={{ backgroundImage: `url(${inv.image_url})` }} />
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0a192f] mb-1">{inv.name}</h2>
                  <p className="text-gray-500 text-sm">{inv.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{T.modal_yield}</div>
                  <div className="text-3xl font-black text-[#137fec]">{inv.target_roi}%</div>
                </div>
              </div>
              {inv.description && <p className="text-gray-600 leading-relaxed mb-6 text-sm">{inv.description}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {inv.vessel_year && <div className="bg-[#f6f7f8] rounded-xl p-4 text-center"><div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{T.modal_build}</div><div className="font-black text-[#0a192f]">{inv.vessel_year}</div></div>}
                {inv.vessel_length && <div className="bg-[#f6f7f8] rounded-xl p-4 text-center"><div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{T.modal_length}</div><div className="font-black text-[#0a192f]">{inv.vessel_length}</div></div>}
                {inv.vessel_cabins && <div className="bg-[#f6f7f8] rounded-xl p-4 text-center"><div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{T.modal_cabins}</div><div className="font-black text-[#0a192f]">{inv.vessel_cabins}</div></div>}
                <div className="bg-[#f6f7f8] rounded-xl p-4 text-center"><div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{T.modal_min}</div><div className="font-black text-[#0a192f]">{inv.currency} {Number(inv.min_investment).toLocaleString()}</div></div>
              </div>
              {inv.total_slots > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-gray-700">{T.modal_slots}</span><span className="font-black text-[#137fec]">{inv.available_slots} / {inv.total_slots} {T.label_remaining}</span></div>
                  <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-[#137fec] rounded-full" style={{ width: `${slotsPercent}%` }} /></div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setModalOpen(false); onInvest(inv); }} className="flex-1 py-4 bg-[#137fec] text-white rounded-xl font-bold hover:bg-[#0f6fd4] transition-colors">{T.btn_invest}</button>
                <button onClick={() => setModalOpen(false)} className="px-6 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">{T.modal_close}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InvestmentsList() {
  const { lang } = useLang();
  const T = t[lang].inv;
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "upcoming">("all");
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [investOpen, setInvestOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/public/investments`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setInvestments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = investments.filter((inv) => {
    if (filter === "active") return inv.status === "fundraising" || inv.status === "active";
    if (filter === "upcoming") return inv.status === "upcoming" || inv.status === "coming_soon";
    return true;
  });

  return (
    <section className="px-6 lg:px-20 py-16 bg-[#f6f7f8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 mb-10">
          {(["all", "active", "upcoming"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${filter === f ? "bg-[#0a192f] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"}`}>
              {f === "all" ? T.filter_all : f === "active" ? T.filter_active : T.filter_upcoming}
            </button>
          ))}
        </div>
        {loading && <div className="text-center py-20 text-gray-400">Loading...</div>}
        {!loading && filtered.length === 0 && <div className="text-center py-20 text-gray-400">No investments found.</div>}
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((inv) => <InvestmentCard key={inv.id} inv={inv} onInvest={(i) => { setSelectedInvestment(i); setInvestOpen(true); }} />)}
        </div>
      </div>
      <InvestModal open={investOpen} onClose={() => { setInvestOpen(false); setSelectedInvestment(null); }} defaultAmount={selectedInvestment?.min_investment?.toString() || ""} />
    </section>
  );
}

function InvestmentsStats() {
  const { lang } = useLang();
  const T = t[lang].inv;
  const stats = [
    { target: 300, suffix: "+", label: T.stat1 },
    { target: 10, suffix: "%", label: T.stat2 },
    { target: 72, suffix: "%", label: T.stat3 },
  ];
  return (
    <section className="px-6 lg:px-20 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((s) => {
            const { value, ref } = useCountUpOnce(s.target);
            return (
              <div key={s.label} ref={ref} className="text-center">
                <div className="text-4xl font-black text-[#137fec] mb-2">{value}{s.suffix}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
