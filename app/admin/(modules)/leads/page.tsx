"use client";

import { useRouter } from "next/navigation";
import { useLeads } from "./hooks/useLeads";
import { useState } from "react";
import LeadsTable from "@/components/LeadsTable";

export default function LeadsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { leads, loading, error, pagination } = useLeads({
    page
  });

  function openLead(lead_id: string) {
    router.push(`/admin/leads/${lead_id}`);
  }

  function nextPage() {
    if (pagination.page < pagination.totalPages) {
      setPage(pagination.page + 1);
    }
  }

  function prevPage() {
    if (pagination.page > 1) {
      setPage(pagination.page - 1);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Leads</h1>

      {loading && <p>Loading leads...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {!loading && !error && leads.length === 0 && (
        <p>No leads found.</p>
      )}

      {!loading && !error && leads.length > 0 && (
        <LeadsTable leads={leads} openLead={openLead} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={prevPage} disabled={pagination.page === 1}>
          Previous
        </button>

        <span style={{ fontSize: 14 }}>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
        Total leads: {pagination.total}
      </div>
    </div>
  );
}