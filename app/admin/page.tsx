"use client";

import Link from "next/link";
import { Users, ArrowDownToLine, Settings, TrendingUp } from "lucide-react";

export default function AdminPage() {
  const cards = [
    {
      title: "Leads",
      description: "Manage sales pipeline and track prospects",
      href: "/admin/leads",
      icon: Users,
      color: "bg-blue-50",
      iconColor: "text-[#137fec]",
    },
    {
      title: "Withdrawals",
      description: "Investor withdrawal requests and payments",
      href: "/admin/withdrawals",
      icon: ArrowDownToLine,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "System & Finance",
      description: "Profit events, releases, and admin tools",
      href: "/admin/system",
      icon: Settings,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a192f] mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome to Yacht Fund CRM</p>
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
