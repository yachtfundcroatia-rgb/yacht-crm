import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-[#060f18] text-gray-400 py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⛵</span>
            <span className="text-lg font-black text-white uppercase tracking-tight">Yacht Fund</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Premier yacht charter investment fund specializing in the Adriatic Sea. Licensed and regulated nautical opportunities.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Fund</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
            <li><Link href="/investments" className="hover:text-white transition-colors">Investment Tiers</Link></li>
            <li><Link href="/security" className="hover:text-white transition-colors">Exit Strategy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/security" className="hover:text-white transition-colors">Legal Disclosures</Link></li>
            <li><Link href="/security" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Office: Split, Croatia</li>
            <li>invest@yachtfund.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <span>© {new Date().getFullYear()} Yacht Fund Adriatic Portfolio. All rights reserved.</span>
        <span>Financial investments in yachting carry risks. Consult your advisor.</span>
      </div>
    </footer>
  );
}