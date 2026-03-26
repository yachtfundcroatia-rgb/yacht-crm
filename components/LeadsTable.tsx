"use client";

import { Lead } from "@/lib/types";

interface Props {
  leads: Lead[];
  openLead: (id: string) => void;
}

export default function LeadsTable({ leads, openLead }: Props) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: 20,
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Created</th>
        </tr>
      </thead>

      <tbody>
        {leads.map((lead) => (
          <tr
            key={lead.id}
            onClick={() => openLead(lead.id)}
            style={{ cursor: "pointer" }}
          >
            <td style={tdStyle}>{lead.full_name}</td>
            <td style={tdStyle}>{lead.email}</td>
            <td style={tdStyle}>{lead.status}</td>
            <td style={tdStyle}>
              {new Date(lead.created_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};