"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminProvider, useAdmin } from "../context/AdminContext";
import {
  LayoutDashboard,
  ArrowDownToLine,
  Users,
  Settings,
  LogOut,
  Anchor,
} from "lucide-react";

const LOGO_URL = "https://rhmgpxpirrclysplitzz.supabase.co/storage/v1/object/public/assets/YACHT%20FUND%20white%20main%20%20.png";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setAdmin } = useAdmin();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function validate() {
      const token = localStorage.getItem("admin_token");
      if (!token) { router.replace("/login"); return; }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { localStorage.removeItem("admin_token"); router.replace("/login"); return; }
        const data = await res.json();
        setAdmin({ id: data.id, role: data.role });
        setAuthorized(true);
      } catch {
        router.replace("/login");
      }
    }
    validate();
  }, [router, setAdmin]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center" style={{ fontFamily: "Manrope, sans-serif" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}

function Sidebar() {
  const { admin } = useAdmin();
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["superadmin", "sales"] },
    { label: "Leads", href: "/admin/leads", icon: Users, roles: ["superadmin", "sales"] },
    { label: "Withdrawals", href: "/admin/withdrawals", icon: ArrowDownToLine, roles: ["superadmin"] },
    { label: "System", href: "/admin/system", icon: Settings, roles: ["superadmin"] },
  ];

  return (
    <div className="w-56 flex-shrink-0 flex flex-col" style={{ background: "#0a192f", minHeight: "100vh" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" target="_blank">
          <img src={LOGO_URL} alt="Yacht Fund" className="h-7 w-auto object-contain" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu
          .filter((item) => admin && item.roles.includes(admin.role))
          .map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#137fec] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 text-xs text-white/40">
          <span className="font-semibold text-white/60">Role:</span> {admin?.role}
        </div>
      </div>
    </div>
  );
}

function Topbar() {
  const router = useRouter();
  const { admin } = useAdmin();
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/leads": "Leads",
    "/admin/withdrawals": "Withdrawals",
    "/admin/system": "System & Finance",
    "/admin/system/profit-events": "Profit Events",
    "/admin/system/profit-release": "Profit Release",
    "/admin/system/discretionary-bonus": "Discretionary Bonus",
    "/admin/system/admins": "Admin Management",
    "/admin/system/investments": "Investment Management",
  };

  const title = Object.entries(titles).reverse().find(([key]) => pathname.startsWith(key))?.[1] || "CRM";

  function logout() {
    localStorage.removeItem("admin_token");
    router.replace("/login");
  }

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="font-black text-[#0a192f] text-lg">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{admin?.role}</span>
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Manrope, sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="flex-1 overflow-auto bg-[#f6f7f8] p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AdminProvider>
  );
}
