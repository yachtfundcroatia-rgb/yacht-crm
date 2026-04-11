"use client";

import Link from "next/link";

export default function SystemPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 26, marginBottom: 30 }}>System & Finance</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        <SystemCard
          title="Profit Events"
          description="Register new profit events"
          href="/admin/system/profit-events"
        />
        <SystemCard
          title="Profit Release"
          description="Distribute profit to investors"
          href="/admin/system/profit-release"
        />
        <SystemCard
          title="Discretionary Bonus"
          description="Add manual investor bonus"
          href="/admin/system/discretionary-bonus"
        />
        <SystemCard
          title="Admin Management"
          description="Manage admin accounts"
          href="/admin/system/admins"
        />
        <SystemCard
          title="Investments"
          description="Manage investment opportunities on the website"
          href="/admin/system/investments"
        />
      </div>
    </div>
  );
}

function SystemCard({
  title,
  description,
  href,
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
        background: "#fafafa",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#666" }}>{description}</p>
    </Link>
  );
}
