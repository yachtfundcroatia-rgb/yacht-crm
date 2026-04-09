export type LeadStatus =
  | "new"
  | "call_scheduled"
  | "call_done"
  | "interested"
  | "waiting_for_transfer"
  | "converted"
  | "lost";

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: LeadStatus;
  assigned_admin_id?: string | null;
  created_at: string;
  last_contact_at?: string | null;
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
  allowedTransitions: string[];
  reservation: any | null;
}