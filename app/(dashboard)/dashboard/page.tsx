"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { fetchProductsAsync } from '@/lib/store/slices/productSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingDown, Layers, DollarSign, Laptop, CheckCircle, AlertTriangle, Wrench } from 'lucide-react';
import { ProductTable } from '@/components/dashboard/product-table';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalAssets = products.length;
    const assignedAssets = products.filter((p) => p.status === "Assigned").length;
    const availableAssets = products.filter((p) => p.status === "Available").length;
    const underRepairAssets = products.filter((p) => p.status === "Under Repair").length;
    const retiredAssets = products.filter((p) => p.status === "Retired").length;

    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    const assetsByDepartment = products.reduce((acc: Record<string, number>, p) => {
      if (p.department) {
        acc[p.department] = (acc[p.department] || 0) + 1;
      }
      return acc;
    }, {});

    const assetsByType = products.reduce((acc: Record<string, number>, p) => {
      if (p.assetType) {
        acc[p.assetType] = (acc[p.assetType] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      totalAssets,
      assignedAssets,
      availableAssets,
      underRepairAssets,
      retiredAssets,
      totalValue,
      assetsByDepartment,
      assetsByType,
    };
  }, [products]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your IT asset management system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total IT Assets
            </CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Hardware devices tracked
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.assignedAssets}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently with employees
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Assets
            </CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for assignment
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Under Repair
            </CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underRepairAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Assets being serviced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asset Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined value of all assets
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Assets by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.assetsByDepartment)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{dept}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              {Object.keys(stats.assetsByDepartment).length === 0 && (
                <p className="text-xs text-muted-foreground">No assignments yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Assets by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.assetsByType)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{type}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              {Object.keys(stats.assetsByType).length === 0 && (
                <p className="text-xs text-muted-foreground">No assets yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>IT Assets Overview</CardTitle>
          <CardDescription>
            Manage and track your IT hardware assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} />
        </CardContent>
      </Card>
    </div>
  );
}
