// lib/types.ts

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
  investment_ref: string;
  requested_amount: number;
  status: WithdrawalStatus;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
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