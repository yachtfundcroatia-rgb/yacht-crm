"use client";

import { useEffect, useState } from "react";
import { getWithdrawals } from "@/lib/api";

export interface Withdrawal {
  id: string;
  investor_ref: string;
  requested_amount: number;
  status: string;
  created_at: string;
}

export function useWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const res = await getWithdrawals();
      setWithdrawals(res.data);

    } catch (err: any) {
      setError(err.message || "Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    withdrawals,
    loading,
    error,
    reload: load
  };
}