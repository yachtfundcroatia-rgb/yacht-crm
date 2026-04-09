export type AdminRole = "superadmin" | "sales";

export interface Admin {
  id: string;
  role: AdminRole;
}

export type WithdrawalStatus =
  | "pending"
  | "approved"
  | "paid"
  | "rejected";

export interface Withdrawal {
  id: string;
  investor_ref: string;
  investment_ref?: string | null;
  requested_amount: number;
  status: WithdrawalStatus;
  created_at: string;
  approved_at?: string | null;
  paid_at?: string | null;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: string;
  assigned_admin_id?: string | null;
  created_at: string;
  last_contact_at?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}