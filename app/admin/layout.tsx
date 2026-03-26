"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminProvider, useAdmin } from "../context/AdminContext";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setAdmin } = useAdmin();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function validate() {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          localStorage.removeItem("admin_token");
          router.replace("/login");
          return;
        }

        const data = await res.json();

        setAdmin({
          id: data.id,
          role: data.role,
        });

        setAuthorized(true);
      } catch {
        router.replace("/login");
      }
    }

    validate();
  }, [router, setAdmin]);

  if (authorized === null) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}

function Sidebar() {
  const { admin } = useAdmin();
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/admin", roles: ["superadmin", "sales"] },
    { label: "Withdrawals", href: "/admin/withdrawals", roles: ["superadmin"] },
    { label: "Leads", href: "/admin/leads", roles: ["superadmin", "sales"] },
    { label: "System", href: "/admin/system", roles: ["superadmin"] },
  ];

  return (
    <div style={{ width: 220, background: "#111", color: "white", padding: 20 }}>
      <h2 style={{ marginBottom: 30 }}>Yacht CRM</h2>

      {menu
        .filter((item) => admin && item.roles.includes(admin.role))
        .map((item) => (
          <div key={item.href} style={{ marginBottom: 15 }}>
            <Link
              href={item.href}
              style={{
                color: pathname === item.href ? "white" : "#aaa",
                textDecoration: "none",
                fontWeight: pathname === item.href ? "bold" : "normal",
              }}
            >
              {item.label}
            </Link>
          </div>
        ))}
    </div>
  );
}

function Topbar() {
  const router = useRouter();
  const { admin } = useAdmin();

  function logout() {
    localStorage.removeItem("admin_token");
    router.replace("/login");
  }

  return (
    <div
      style={{
        height: 60,
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <div>
        Logged as: <strong>{admin?.role}</strong>
      </div>

      <button
        onClick={logout}
        style={{
          padding: "6px 12px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <div style={{ padding: 30, overflow: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AdminProvider>
  );
}