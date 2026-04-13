"use client";

import Link from "next/link";
import { TrendingUp, DollarSign, Gift, Users, Ship } from "lucide-react";

export default function SystemPage() {
  const cards = [
    {
      title: "Profit Events",
      description: "Register new profit events for investments",
      href: "/admin/system/profit-events",
      icon: TrendingUp,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Profit Release",
      description: "Distribute profit to investors",
      href: "/admin/system/profit-release",
      icon: DollarSign,
      color: "bg-blue-50",
      iconColor: "text-[#137fec]",
    },
    {
      title: "Discretionary Bonus",
      description: "Add manual investor bonuses",
      href: "/admin/system/discretionary-bonus",
      icon: Gift,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Admin Management",
      description: "Manage admin accounts and roles",
      href: "/admin/system/admins",
      icon: Users,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Investments",
      description: "Manage investment opportunities on the website",
      href: "/admin/system/investments",
      icon: Ship,
      color: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">System & Finance</h1>
        <p className="text-gray-500 text-sm">Financial operations and system management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow no-underline group"
            >
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <h3 className="font-black text-[#0a192f] mb-1 group-hover:text-[#137fec] transition-colors">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
