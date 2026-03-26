"use client";

import { useEffect, useState, useCallback } from "react";
import { Lead } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseLeadsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export function useLeads(initialParams: UseLeadsParams = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async (params: UseLeadsParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;

      const query = new URLSearchParams();

      const page = params.page ?? pagination.page;
      const limit = params.limit ?? pagination.limit;

      query.append("page", String(page));
      query.append("limit", String(limit));

      if (params.status) query.append("status", params.status);
      if (params.search) query.append("search", params.search);

      const res = await fetch(
        `${API_URL}/api/admin/leads?${query.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
        }

        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch leads");
      }

      const data = await res.json();

      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    pagination,
    loading,
    error,
    fetchLeads,
  };
}