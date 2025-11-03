"use client";

import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductTable } from "@/components/dashboard/product-table";
import { Button } from "@/components/ui/button";
import { Package, Users, DollarSign, AlertTriangle, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProductsService,
  deleteProductService,
  type ProductFilters,
} from "@/services/product/productService";
import { toast } from "sonner";
import type {
  Product,
  ProductsResponse,
  DashboardStats,
} from "@/types/product";

// Default stats
const defaultStats = {
  total: 0,
  totalValue: 0,
  assigned: 0,
  available: 0,
  underRepair: 0,
  retired: 0,
  statusData: [],
  conditionData: [],
  assetTypeData: [],
  departmentData: [],
  avgPrice: 0,
  maxPrice: 0,
  minPrice: 0,
  currentPage: 1,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPrevPage: false,
};

const defaultPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
};

const defaultDashboardStats: DashboardStats = {
  total: 0,
  assigned: 0,
  available: 0,
  underRepair: 0,
  totalValue: 0,
  totalAssets: 0,
  deptData: [],
  statusData: [],
  conditionData: [],
  trendData: [],
  typeData: [],
  topEmployees: [],
  depreciation: [],
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [stats, setStats] = useState(defaultStats);
  const [dashboardStats, setDashboardStats] = useState(defaultDashboardStats);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products function
  const fetchProducts = useCallback(async (params: URLSearchParams) => {
    try {
      setIsLoadingProducts(true);
      setError(null);

      const filters: ProductFilters = {
        search: params.get("search") || undefined,
        department: params.get("department") || undefined,
        assetType: params.get("assetType") || undefined,
        status: params.get("status") || undefined,
        condition: params.get("condition") || undefined,
        startDate: params.get("startDate") || undefined,
        endDate: params.get("endDate") || undefined,
        page: parseInt(params.get("page") || "1"),
        limit: parseInt(params.get("limit") || "10"),
        sortBy: params.get("sortBy") || undefined,
        sortDirection: params.get("sortDirection") || undefined,
      };

      const response: any = await getProductsService(filters);

      if (response.success) {
        setProducts(response.data || []);
        setPagination(response.pagination || defaultPagination);
        setStats(response.stats || defaultStats);

        // Update dashboard stats from API response
        if (response.stats) {
          setDashboardStats({
            total: response.stats.total,
            assigned: response.stats.assigned,
            available: response.stats.available,
            underRepair: response.stats.underRepair,
            totalValue: response.stats.totalValue,
            totalAssets: response.stats.total,
            deptData: response.stats.departmentData,
            statusData: response.stats.statusData,
            conditionData: response.stats.conditionData,
            trendData: [],
            typeData: response.stats.assetTypeData,
            topEmployees: [],
            depreciation: [],
          });
        }
      } else {
        throw new Error(response.error || "Failed to fetch products");
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
      setIsLoadingProducts(false);
    }
  }, []);

  // Initialize from URL search params on mount
  useEffect(() => {
    const params = new URLSearchParams();
    const hasUrlParams = searchParams.toString().length > 0;

    if (hasUrlParams) {
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
      console.log("🔄 Restored state from URL:", params.toString());
    } else {
      params.set("page", "1");
      params.set("limit", "10");
      params.set("sortBy", "createdAt");
      params.set("sortDirection", "desc");
      console.log("🔄 Using default params:", params.toString());
    }

    fetchProducts(params);
  }, [fetchProducts, searchParams]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      fetchProducts(params);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [fetchProducts]);

  const handleRefetch = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      console.log("🔁 Refetch triggered with:", query);

      // Update browser URL without causing a page reload
      const newUrl = `${window.location.pathname}?${query}`;
      window.history.replaceState({}, "", newUrl);

      fetchProducts(params);
    },
    [fetchProducts]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteProductService(id);
        toast.success("Product deleted successfully");

        // Refetch current data after successful deletion
        const currentParams = new URLSearchParams(window.location.search);
        setTimeout(() => {
          fetchProducts(currentParams);
        }, 500);
      } catch (err: any) {
        console.error("Failed to delete product:", err);
        toast.error(err.message || "Failed to delete product");
        throw err;
      }
    },
    [fetchProducts]
  );

  // Stats Cards Component with Skeleton
  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    loading,
  }: any) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-7 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            IT Assets
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage hardware assets assigned to employees
          </p>
        </div>

        {/* Add New Asset Button */}
        {/* <Link href="/products/new">
          <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Asset
          </Button>
        </Link> */}
      </div>

      {/* Stats Overview with Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assets"
          value={stats?.total?.toLocaleString() || "0"}
          icon={Package}
          description="All company assets"
          loading={isLoading}
        />
        <StatCard
          title="Total Value"
          value={`$${(stats?.totalValue || 0).toLocaleString()}`}
          icon={DollarSign}
          description="Current asset value"
          loading={isLoading}
        />
        <StatCard
          title="Assigned"
          value={stats?.assigned?.toLocaleString() || "0"}
          icon={Users}
          description="Currently in use"
          loading={isLoading}
        />
        <StatCard
          title="Maintenance"
          value={stats?.underRepair?.toLocaleString() || "0"}
          icon={AlertTriangle}
          description="Requires attention"
          loading={isLoading}
        />
      </div>

      {/* Main Table */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
            All IT Assets
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            View, search, filter, and manage your IT hardware assets
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProductTable
            products={products}
            pagination={pagination}
            onRefetch={handleRefetch}
            onDelete={handleDelete}
            loading={isLoadingProducts}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
