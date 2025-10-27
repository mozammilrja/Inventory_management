
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProductsAsync } from "@/lib/store/slices/productSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatNumber } from "../../../lib/helper";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ComposedChart,
} from "recharts";
import {
  Laptop,
  CheckCircle,
  Package,
  Wrench,
  DollarSign,
} from "lucide-react";

const KPI_COLORS = ["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EC4899"];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading: isLoading } = useAppSelector((s) => s.product);

  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("All");
  const [range, setRange] = useState<Date[]>([]);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const inDept = dept === "All" || p.department === dept;
      const inDateRange =
        range.length !== 2 ||
        (p.purchaseDate &&
          new Date(p.purchaseDate) >= range[0] &&
          new Date(p.purchaseDate) <= range[1]);
      const inQuery =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.serialNumber?.toLowerCase().includes(q) ||
        p.employeeName?.toLowerCase().includes(q);

      return inDept && inDateRange && inQuery;
    });
  }, [products, dept, range, query]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const totalValue = filtered.reduce((s, p) => s + (p.price || 0), 0);

    const groupBy = <K extends string>(
      keyFn: (p: any) => K | undefined,
      label = "Unknown"
    ) =>
      Object.entries(
        filtered.reduce((acc: Record<string, number>, p) => {
          const key = keyFn(p) || label;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, count]) => ({ name, count }));

    const statusData = groupBy((p) => p.status);
    const deptData = groupBy((p) => p.department);
    const typeData = groupBy((p) => p.assetType || p.category);

    const trendMap = filtered.reduce((acc: Record<string, number>, p) => {
      if (!p.purchaseDate) return acc;
      const d = new Date(p.purchaseDate);
      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const trendData = Object.entries(trendMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    const empMap = filtered.reduce((acc: Record<string, number>, p) => {
      if (!p.employeeName) return acc;
      acc[p.employeeName] = (acc[p.employeeName] || 0) + 1;
      return acc;
    }, {});
    const topEmployees = Object.entries(empMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const depreciation = filtered
      .filter((p) => p.purchaseDate && p.price)
      .map((p) => {
        const years =
          (Date.now() - new Date(p.purchaseDate ?? 0).getTime()) /
          (1000 * 60 * 60 * 24 * 365);
        return {
          name: p.name,
          original: p.price,
          current: Math.round(p.price * Math.pow(0.8, years)),
        };
      })
      .slice(0, 12);

    return {
      total,
      totalValue,
      deptData,
      typeData,
      trendData,
      statusData,
      topEmployees,
      depreciation,
    };
  }, [filtered]);

  const uniqueDepts = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.department)
            .filter((d): d is string => typeof d === "string" && d.trim() !== "")
        )
      ),
    [products]
  );

  const handleReset = useCallback(() => {
    setDept("All");
    setRange([]);
    setQuery("");
  }, []);

  const KPI = useCallback(
    ({
      title,
      value,
      icon,
      colorIndex = 0,
      isLoading = false,
    }: {
      title: string;
      value: string | number;
      icon?: React.ReactNode;
      colorIndex?: number;
      isLoading?: boolean;
    }) => (
      <Card className="p-4 shadow-md border-0 bg-gradient-to-br from-white/60 to-slate-50/40 dark:from-slate-900/60 dark:to-slate-800/40 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-2 bg-muted animate-pulse rounded" />
            ) : (
              <div className="mt-2 text-2xl font-semibold">{value}</div>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
          ) : (
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ background: `${KPI_COLORS[colorIndex]}22` }}
            >
              {icon}
            </div>
          )}
        </div>
      </Card>
    ),
    []
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Assets Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
Comprehensive analytics to track your assets          </p>
        </div>

 {/* Filters - Responsive and Shimmer on Load */}
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
  {isLoading ? (
    // 🔸 Skeleton shimmer placeholders (Select, DatePicker, Reset)
    <>
      <div className="h-10 w-full sm:w-[180px] rounded-md bg-muted animate-pulse" />
      <div className="h-10 w-full sm:w-[200px] rounded-md bg-muted animate-pulse" />
      <div className="h-10 w-full sm:w-[100px] rounded-md bg-muted animate-pulse" />
    </>
  ) : (
    // 🔸 Actual UI when loaded
    <>
      <Select value={dept} onValueChange={setDept}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Departments</SelectItem>
          {uniqueDepts.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Flatpickr
        className="border rounded-md px-3 py-2 text-sm bg-background text-foreground w-full sm:w-[200px]"
        placeholder="Date range"
        options={{ mode: "range", dateFormat: "Y-m-d" }}
        value={range}
        onChange={(dates) => setRange(dates as Date[])}
      />

      <Button
        variant="ghost"
        onClick={handleReset}
        className="w-full sm:w-auto"
      >
        Reset
      </Button>
    </>
  )}
</div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPI
          title="Total Assets"
          value={stats.total}
          icon={<Laptop className="h-5 w-5 text-blue-600" />}
          colorIndex={0}
          isLoading={isLoading}
        />
        <KPI
          title="Assigned"
          value={stats.statusData.find((s) => s.name === "Assigned")?.count || 0}
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          colorIndex={1}
          isLoading={isLoading}
        />
        <KPI
          title="Available"
          value={stats.statusData.find((s) => s.name === "Available")?.count || 0}
          icon={<Package className="h-5 w-5 text-sky-600" />}
          colorIndex={2}
          isLoading={isLoading}
        />
        <KPI
          title="Under Repair"
          value={stats.statusData.find((s) => s.name === "Under Repair")?.count || 0}
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
          colorIndex={3}
          isLoading={isLoading}
        />
        <KPI
          title="Total Value"
            value={`$${formatNumber(stats.totalValue || 0)}`}
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          colorIndex={4}
          isLoading={isLoading}
        />
      </div>

      {/* MAIN DASHBOARD GRID */}
      {isLoading ? <DashboardSkeleton /> : <DashboardCharts stats={stats} />}
    </div>
  );
}

/** Responsive chart layout */
const DashboardCharts = React.memo(({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* LEFT SIDE - 2 columns on XL */}
      <div className="xl:col-span-2 space-y-6">
        {/* Purchase Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Trend</CardTitle>
            <CardDescription>Monthly purchases overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.trendData}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
               <XAxis
  dataKey="month"
  stroke="#6b7280"
  tick={{ fontSize: 12 }}
  tickMargin={8}
  interval="preserveStartEnd" // only show start, mid, end
/>

                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB"
                  fill="url(#trendFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department & Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Bar */}
         <Card>
  <CardHeader>
    <CardTitle>Assets by Department</CardTitle>
    <CardDescription>Breakdown by department</CardDescription>
  </CardHeader>

  <CardContent>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={stats.deptData}
        margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          tick={{ fontSize: 12 }}
          tickMargin={8}
          interval={0}
        />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey="count"
          fill="#10B981"
          radius={[6, 6, 0, 0]}
          barSize={32}
          isAnimationActive={true}
          label={{
            position: "top",
            fill: "#6b7280",
            fontSize: 12,
            formatter: (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value),
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


          {/* Type Pie */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Types</CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={stats.typeData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    labelLine={false}
                    label={false}
                  >
                    {stats.typeData.map(({ name }: any, i: number) => (
                      <Cell key={name} fill={KPI_COLORS[i % KPI_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend below chart */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {stats.typeData.map((item: any, i: number) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: KPI_COLORS[i % KPI_COLORS.length] }}
                    />
                    <div className="text-xs sm:text-sm truncate">
                      {item.name} ({item.count})
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Overview */}
<Card>
  <CardHeader>
    <CardTitle>Department Value Overview</CardTitle>
    <CardDescription>Compare value vs asset count</CardDescription>
  </CardHeader>

  <CardContent>
    {stats?.deptData?.length ? (
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={stats.deptData.map((d: any) => ({
            ...d,
            value: Math.round(
              ((d.count || 0) / (stats.total || 1)) *
                (stats.totalValue || 0) /
                10
            ),
          }))}
          margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            yAxisId="left"
            stroke="#10B981"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10B981"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Bar (Count) */}
          <Bar
            yAxisId="left"
            dataKey="count"
            barSize={28}
            fill="#6366F1"
            radius={[6, 6, 0, 0]}
          />

          {/* Area (Value) */}
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={2}
            fill="#10B98133"
            fillOpacity={0.4}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex items-center justify-center h-[260px] text-muted-foreground">
        No data available
      </div>
    )}
  </CardContent>
</Card>

      </div>

      {/* RIGHT SIDE - 1 column on XL */}
      <div className="space-y-6">
        {/* Asset Status */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Status</CardTitle>
            <CardDescription>Availability & health</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {stats.statusData.map((_: any, idx: any) => (
                    <Cell key={idx} fill={KPI_COLORS[idx % KPI_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {stats.statusData.map((s: any, i: any) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: KPI_COLORS[i % KPI_COLORS.length] }}
                    />
                    <div className="text-sm">{s.name}</div>
                  </div>
                  <div className="font-medium">{s.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Depreciation */}
        <Card>
          <CardHeader>
            <CardTitle>Depreciation Snapshot</CardTitle>
            <CardDescription>Current vs original values</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stats.depreciation}>
                <XAxis dataKey="name" hide />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: "#F59E0B", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Employees */}
        <Card>
          <CardHeader>
            <CardTitle>Top Employees</CardTitle>
            <CardDescription>Most assigned assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topEmployees.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No assignments found
              </div>
            )}
            {stats.topEmployees.map((e: any) => (
              <div key={e.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {(e.name || "?").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.count} assets
                    </div>
                  </div>
                </div>
                <div className="font-medium">{e.count}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

// Loading Skeleton Component
const DashboardSkeleton = React.memo(() => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2 space-y-6">
      {/* Purchase Trend Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-muted animate-pulse rounded" />
          <Skeleton className="h-4 w-48 mt-2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[220px] w-full bg-muted animate-pulse rounded-md" />
        </CardContent>
      </Card>

      {/* Department & Type Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 bg-muted animate-pulse rounded" />
            <Skeleton className="h-4 w-36 mt-2 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full bg-muted animate-pulse rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 bg-muted animate-pulse rounded" />
            <Skeleton className="h-4 w-40 mt-2 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[160px] w-full bg-muted animate-pulse rounded-md" />
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-5 w-full bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value Overview Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-muted animate-pulse rounded" />
          <Skeleton className="h-4 w-56 mt-2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[240px] w-full bg-muted animate-pulse rounded-md" />
        </CardContent>
      </Card>
    </div>

    {/* Right Side Skeleton */}
    <div className="space-y-6">
      {/* Asset Status Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-muted animate-pulse rounded" />
          <Skeleton className="h-4 w-40 mt-2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[160px] w-full bg-muted animate-pulse rounded-md" />
          <div className="space-y-2 mt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Depreciation Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-muted animate-pulse rounded" />
          <Skeleton className="h-4 w-48 mt-2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[180px] w-full bg-muted animate-pulse rounded-md" />
        </CardContent>
      </Card>

      {/* Top Employees Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-muted animate-pulse rounded" />
          <Skeleton className="h-4 w-40 mt-2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <Skeleton className="h-3 w-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <Skeleton className="h-5 w-8 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
));

DashboardCharts.displayName = "DashboardCharts";
DashboardSkeleton.displayName = "DashboardSkeleton";