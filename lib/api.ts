// lib/api.ts

import { Withdrawal, PaginatedResponse } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://yacht-backend.vercel.app";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }

    const errorData = await res.json().catch(() => ({}));

    throw new ApiError(
      errorData.error || "API Error",
      res.status
    );
  }

  return res.json();
}

export async function getWithdrawals() {
  return request<PaginatedResponse<Withdrawal>>(
    "/api/admin/withdrawals"
  );
}

export async function updateWithdrawalStatus(
  withdrawal_id: string,
  new_status: Withdrawal["status"]
) {
  return request<{
    success: boolean;
    request: Withdrawal;
  }>("/api/admin/withdrawals/update-status", {
    method: "POST",
    body: JSON.stringify({ withdrawal_id, new_status }),
  });
}