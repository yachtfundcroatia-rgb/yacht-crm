"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/app/context/AdminContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Investment {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url: string;
  target_roi: number;
  min_investment: number;
  total_slots: number;
  available_slots: number;
  vessel_year: number;
  vessel_length: string;
  vessel_cabins: number;
  status: string;
  currency: string;
  display_order: number;
}

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  location: "",
  image_url: "",
  target_roi: "",
  min_investment: "10000",
  total_slots: "",
  available_slots: "",
  vessel_year: "",
  vessel_length: "",
  vessel_cabins: "",
  status: "fundraising",
  currency: "EUR",
  display_order: "0",
};

export default function InvestmentsAdminPage() {
  const { token } = useAdmin();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function fetchInvestments() {
    try {
      const res = await fetch(`${API_URL}/api/admin/investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setInvestments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchInvestments();
  }, [token]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setMessage(null);
  }

  function openEdit(inv: Investment) {
    setForm({
      id: inv.id,
      name: inv.name || "",
      description: inv.description || "",
      location: inv.location || "",
      image_url: inv.image_url || "",
      target_roi: inv.target_roi?.toString() || "",
      min_investment: inv.min_investment?.toString() || "10000",
      total_slots: inv.total_slots?.toString() || "",
      available_slots: inv.available_slots?.toString() || "",
      vessel_year: inv.vessel_year?.toString() || "",
      vessel_length: inv.vessel_length || "",
      vessel_cabins: inv.vessel_cabins?.toString() || "",
      status: inv.status || "fundraising",
      currency: inv.currency || "EUR",
      display_order: inv.display_order?.toString() || "0",
    });
    setEditingId(inv.id);
    setShowForm(true);
    setMessage(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...form,
        target_roi: Number(form.target_roi),
        min_investment: Number(form.min_investment),
        total_slots: Number(form.total_slots),
        available_slots: Number(form.available_slots),
        vessel_year: Number(form.vessel_year),
        vessel_cabins: Number(form.vessel_cabins),
        display_order: Number(form.display_order),
      };

      const url = editingId
        ? `${API_URL}/api/admin/investments/${editingId}`
        : `${API_URL}/api/admin/investments`;

      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(editingId ? "Investment updated" : "Investment created");
        setShowForm(false);
        fetchInvestments();
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setSaving(false);
    }
  }

  const statusColors: Record<string, string> = {
    fundraising: "#22c55e",
    active: "#3b82f6",
    upcoming: "#f59e0b",
    coming_soon: "#6b7280",
    closed: "#ef4444",
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Investment Management</h1>
        <button
          onClick={openCreate}
          style={{
            padding: "10px 20px",
            background: "#137fec",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + Add Investment
        </button>
      </div>

      {message && (
        <div style={{
          padding: "12px 16px",
          marginBottom: 16,
          borderRadius: 8,
          background: message.startsWith("Error") ? "#fee2e2" : "#dcfce7",
          color: message.startsWith("Error") ? "#dc2626" : "#16a34a",
          fontWeight: "bold",
        }}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
            {editingId ? "Edit Investment" : "New Investment"}
          </h2>
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Investment ID *</label>
                <input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  disabled={!!editingId}
                  placeholder="e.g. LAGOON_42_2024"
                  required
                  style={{ ...inputStyle, background: editingId ? "#f9fafb" : "white" }}
                />
                {!editingId && (
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    Unique identifier — cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Lagoon 42 Catamaran"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Location *</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Split, Croatia"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the vessel and investment opportunity..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Image URL</label>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://... (paste Supabase Storage URL)"
                  style={inputStyle}
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="preview"
                    style={{ marginTop: 8, height: 80, borderRadius: 6, objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>

              <div>
                <label style={labelStyle}>Target ROI (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.target_roi}
                  onChange={(e) => setForm({ ...form, target_roi: e.target.value })}
                  placeholder="12.0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Min Investment ({form.currency})</label>
                <input
                  type="number"
                  value={form.min_investment}
                  onChange={(e) => setForm({ ...form, min_investment: e.target.value })}
                  placeholder="10000"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Total Slots (marketing)</label>
                <input
                  type="number"
                  value={form.total_slots}
                  onChange={(e) => setForm({ ...form, total_slots: e.target.value })}
                  placeholder="50"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Available Slots (marketing)</label>
                <input
                  type="number"
                  value={form.available_slots}
                  onChange={(e) => setForm({ ...form, available_slots: e.target.value })}
                  placeholder="37"
                  style={inputStyle}
                />
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  Used only for display — does not affect financial model
                </p>
              </div>

              <div>
                <label style={labelStyle}>Vessel Year</label>
                <input
                  type="number"
                  value={form.vessel_year}
                  onChange={(e) => setForm({ ...form, vessel_year: e.target.value })}
                  placeholder="2024"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Vessel Length</label>
                <input
                  value={form.vessel_length}
                  onChange={(e) => setForm({ ...form, vessel_length: e.target.value })}
                  placeholder="12.8m"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Cabins</label>
                <input
                  type="number"
                  value={form.vessel_cabins}
                  onChange={(e) => setForm({ ...form, vessel_cabins: e.target.value })}
                  placeholder="4"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  style={inputStyle}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={inputStyle}
                >
                  <option value="fundraising">Fundraising (Active)</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Display Order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                  placeholder="0"
                  style={inputStyle}
                />
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  Lower number = shown first
                </p>
              </div>

            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "10px 24px",
                  background: saving ? "#ccc" : "#137fec",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Investment"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "10px 24px",
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : investments.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No investments yet. Click Add Investment to create one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {investments.map((inv) => (
            <div
              key={inv.id}
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {inv.image_url && (
                <img
                  src={inv.image_url}
                  alt={inv.name}
                  style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: "bold", fontSize: 16 }}>{inv.name}</span>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: "bold",
                    background: `${statusColors[inv.status] || "#6b7280"}20`,
                    color: statusColors[inv.status] || "#6b7280",
                  }}>
                    {inv.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {inv.location} · ROI: {inv.target_roi}% · Slots: {inv.available_slots}/{inv.total_slots} · Min: {inv.currency} {Number(inv.min_investment).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => openEdit(inv)}
                style={{
                  padding: "8px 16px",
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: "600",
  color: "#374151",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
