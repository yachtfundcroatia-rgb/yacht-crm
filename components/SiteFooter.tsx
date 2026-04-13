"use client";

import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

const LOGO_URL = "https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/YACHT%20FUND%20white%20main%20%20.png";

export default function SiteFooter() {
  const { lang } = useLang();
  const T = t[lang].footer;
  const Tn = t[lang].nav;

  return (
    <footer className="bg-[#060f18] text-gray-400 py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={LOGO_URL} alt="Yacht Fund" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{T.desc}</p>
          <p className="text-xs text-gray-500">
            Blue Wave Group d.o.o<br />
            Bukovačka ulica 23<br />
            Biograd Na Moru, 23210 Croatia<br />
            OIB: 97893023854
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">{T.fund}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">{Tn.how_it_works}</Link></li>
            <li><Link href="/investments" className="hover:text-white transition-colors">{Tn.investments}</Link></li>
            <li><Link href="/security" className="hover:text-white transition-colors">{T.exit}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">{T.company}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">{Tn.about}</Link></li>
            <li><Link href="/security" className="hover:text-white transition-colors">{T.legal}</Link></li>
            <li><Link href="/security" className="hover:text-white transition-colors">{T.privacy}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">{T.contact}</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:hi@yacht.fund" className="hover:text-white transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                hi@yacht.fund
              </a>
            </li>
            <li>
              <a href="tel:+38595355133" className="hover:text-white transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.44 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +385 95 35 50 133
              </a>
            </li>
            <li className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Biograd Na Moru, Croatia</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <span>© {new Date().getFullYear()} {T.copyright}</span>
        <span>{T.disclaimer}</span>
      </div>
    </footer>
  );
}
