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
