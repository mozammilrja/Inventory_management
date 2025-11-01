// lib/hooks/useProducts.ts
import { useEffect, useState } from "react";

export function useProducts({
  page = 1,
  limit = 10,
  search = "",
  sortField = "createdAt",
  sortOrder = "desc",
  filters = {},
}: {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string>;
}) {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
      sortField,
      sortOrder,
      ...filters,
    });

    setLoading(true);
    fetch(`/api/products?${query.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data || []);
        setPagination(res.pagination || {});
      })
      .finally(() => setLoading(false));
  }, [page, limit, search, sortField, sortOrder, JSON.stringify(filters)]);

  return { data, pagination, loading };
}
