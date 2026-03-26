"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div style={{ padding: 20 }}>

      <h1 style={{ fontSize: 28, marginBottom: 30 }}>
        Yacht CRM Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20
        }}
      >

        <DashboardCard
          title="Leads"
          description="Manage sales pipeline"
          href="/admin/leads"
        />

        <DashboardCard
          title="Withdrawals"
          description="Investor withdrawal requests"
          href="/admin/withdrawals"
        />

        <DashboardCard
          title="System"
          description="Finance and admin tools"
          href="/admin/system"
        />

      </div>

    </div>
  );
}

function DashboardCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        border: "1px solid #ddd",
        padding: 20,
        borderRadius: 6,
        textDecoration: "none",
        color: "black",
        background: "#fafafa"
      }}
    >
      <h3 style={{ marginBottom: 10 }}>
        {title}
      </h3>

      <p style={{ fontSize: 14, color: "#666" }}>
        {description}
      </p>
    </Link>
  );
}