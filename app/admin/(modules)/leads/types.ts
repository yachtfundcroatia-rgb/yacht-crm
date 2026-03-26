// app/admin/(modules)/leads/types.ts

export type LeadStatus =
  | "new"
  | "call_scheduled"
  | "converted";

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: LeadStatus;
  assigned_admin_id?: string | null;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
  created_by: string;
}

export interface LeadDetailResponse {
  lead: Lead;
  notes: LeadNote[];
}