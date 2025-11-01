"use client";

import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  fetchProductsAsync,
  deleteProductAsync,
} from "@/lib/store/slices/productSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductTable } from "@/components/dashboard/product-table";
import { Package, Users, DollarSign, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure to import Skeleton

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { products, pagination, isLoading, isLoadingProducts, error, stats } =
    useAppSelector((state: any) => state.product);

  const [currentParams, setCurrentParams] = useState<URLSearchParams>(
    new URLSearchParams()
  );

  // FIXED: Initialize from URL search params on mount
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
      params.set("sortField", "createdAt");
      params.set("sortOrder", "desc");
      console.log("🔄 Using default params:", params.toString());
    }

    setCurrentParams(params);
    dispatch(fetchProductsAsync(params));
  }, []);

  const handleRefetch = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      console.log("🔁 Refetch triggered with:", query);
      setCurrentParams(params);
      dispatch(fetchProductsAsync(params));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteProductAsync(id)).unwrap();
        setTimeout(() => {
          dispatch(fetchProductsAsync(currentParams));
        }, 500);
      } catch (err) {
        console.error("Failed to delete product:", err);
        throw err;
      }
    },
    [dispatch, currentParams]
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

  console.log("📊 ProductsPage Render:", {
    productsCount: products?.length,
    pagination,
    stats,
    isLoading: isLoadingProducts,
    error,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            IT Assets
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage hardware assets assigned to employees
          </p>
        </div>
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
            products={products || []}
            pagination={
              pagination || {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null,
              }
            }
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
