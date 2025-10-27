"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { fetchProductsAsync } from "@/lib/store/slices/productSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductTable } from "@/components/dashboard/product-table";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector(
    (state) => state.product
  );
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  // Dynamic skeleton based on product length or default (10 rows)
  const RowSkeleton = ({ count = 10 }: { count?: number }) => (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IT Assets</h1>
        <p className="text-muted-foreground mt-1">
          Manage hardware assets assigned to employees
        </p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>All IT Assets</CardTitle>
          <CardDescription>
            View, search, filter, and manage your IT hardware inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <RowSkeleton count={10} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Failed to load assets. Please try refreshing the page.
              </p>
            </div>
          ) : (
            <ProductTable products={products} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
