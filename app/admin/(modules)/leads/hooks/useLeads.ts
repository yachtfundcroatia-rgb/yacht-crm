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
  limit?: number | string;
  status?: string;
  search?: string;
  source?: string;
  date_from?: string;
  date_to?: string;
  sort?: string;
}

export function useLeads(initialParams: UseLeadsParams = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: initialParams.page || 1,
    limit: typeof initialParams.limit === "number" ? initialParams.limit : 20,
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
      if (params.source) query.append("source", params.source);
      if (params.date_from) query.append("date_from", params.date_from);
      if (params.date_to) query.append("date_to", params.date_to);
      if (params.sort) query.append("sort", params.sort);

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
    fetchLeads({ ...initialParams });
  }, [initialParams.page, initialParams.source, initialParams.date_from, initialParams.date_to, initialParams.limit, initialParams.sort]);

  return {
    leads,
    pagination,
    loading,
    error,
    fetchLeads,
  };
}