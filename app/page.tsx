import Link from "next/link";
import InvestModal from "@/components/InvestModal";
import CallModal from "@/components/CallModal";
import HomeHero from "@/components/HomeHero";
import HomeCalculator from "@/components/HomeCalculator";
import HomeFeatures from "@/components/HomeFeatures";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeCalculator />
        <HomeFeatures />
      </main>
      <SiteFooter />
    </div>
  );
}