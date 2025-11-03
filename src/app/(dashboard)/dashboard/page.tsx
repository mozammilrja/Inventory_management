"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  Package,
  Wrench,
  DollarSign,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Users,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

// Theme-aware colors for both light and dark modes
const KPI_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#6366F1", // Indigo
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EF4444", // Red
  "#F97316", // Orange
  "#14B8A6", // Teal
  "#64748B", // Slate
];

// Custom Tooltip Component with theme support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-semibold text-foreground">
              {entry.dataKey === "value" && typeof entry.value === "number"
                ? `₹${formatNumber(entry.value)}`
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Empty State Component
const EmptyState = ({
  message,
  icon,
  action,
}: {
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
    {icon || <AlertCircle className="h-12 w-12 mb-3 opacity-50" />}
    <p className="text-sm text-center mb-3">{message}</p>
    {action}
  </div>
);

// Error State Component
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-64">
    <AlertCircle className="h-12 w-12 text-destructive mb-3" />
    <p className="text-sm text-center text-destructive mb-4">{message}</p>
    {onRetry && (
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    )}
  </div>
);

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dept, setDept] = useState<string>("All");
  const [assetType, setAssetType] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [condition, setCondition] = useState<string>("All");
  const [range, setRange] = useState<Date[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ✅ OPTIMIZATION 1: Debounce filter changes
  const debouncedDept = useDebounce(dept, 500);
  const debouncedAssetType = useDebounce(assetType, 500);
  const debouncedStatus = useDebounce(status, 500);
  const debouncedCondition = useDebounce(condition, 500);
  const debouncedRange = useDebounce(range, 500);

  // ✅ OPTIMIZATION 2: Data fetcher using direct API call
  const fetchData = useCallback(async (filters?: any) => {
    try {
      setIsLoadingAnalytics(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      // Direct API call to analytics endpoint
      const response = await fetch(
        `/api/assets/analytics?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const analyticsData = await response.json();

      // Set data directly - no transformation needed
      setDashboardStats(analyticsData);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // ✅ OPTIMIZATION 3: Initial load - only once
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ OPTIMIZATION 4: Debounced filter effect
  useEffect(() => {
    const filters: any = {};
    if (debouncedDept !== "All") filters.department = debouncedDept;
    if (debouncedAssetType !== "All") filters.assetType = debouncedAssetType;
    if (debouncedStatus !== "All") filters.status = debouncedStatus;
    if (debouncedCondition !== "All") filters.condition = debouncedCondition;
    if (debouncedRange.length === 2) {
      filters.startDate = debouncedRange[0].toISOString();
      filters.endDate = debouncedRange[1].toISOString();
    }

    fetchData(filters);
  }, [
    debouncedDept,
    debouncedAssetType,
    debouncedStatus,
    debouncedCondition,
    debouncedRange,
    fetchData,
  ]);

  // ✅ OPTIMIZATION 5: Memoized unique departments
  const uniqueDepts = useMemo<string[]>(() => {
    if (!dashboardStats?.deptData) return [];
    return dashboardStats.deptData
      .map((d: any) => d.name)
      .filter((name: string) => name && name !== "Unassigned");
  }, [dashboardStats?.deptData]);

  const handleReset = useCallback(() => {
    setDept("All");
    setAssetType("All");
    setStatus("All");
    setCondition("All");
    setRange([]);
  }, []);

  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
      <Card className="p-4 shadow-sm border bg-card/50 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
            ) : (
              <div className="mt-2 text-2xl font-bold text-foreground">
                {value}
              </div>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="w-12 h-12 rounded-lg dark:bg-muted bg-gray-200 animate-pulse" />
          ) : (
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg border"
              style={{
                background: `color-mix(in srgb, ${KPI_COLORS[colorIndex]} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${KPI_COLORS[colorIndex]} 20%, transparent)`,
              }}
            >
              {React.isValidElement(icon) &&
                React.cloneElement(icon as React.ReactElement, {
                  className: "h-6 w-6",
                  style: { color: KPI_COLORS[colorIndex] },
                })}
            </div>
          )}
        </div>
      </Card>
    ),
    []
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Assets Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive analytics to track your assets
            {lastRefresh && (
              <span className="text-xs ml-2">
                • Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md flex items-center gap-2 border border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="ml-2 h-8 px-2"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto">
          {isLoadingAnalytics ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-full sm:w-[160px] dark:bg-muted bg-gray-200 animate-pulse rounded-md"
                />
              ))}
            </>
          ) : (
            <>
              {/* Department Filter */}
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
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

              {/* Asset Type */}
              <Select value={assetType} onValueChange={setAssetType}>
                <SelectTrigger className="w-full sm:w-[160px] bg-background">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Printer">Printer</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Status */}
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-[140px] bg-background">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Under Repair">Under Repair</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>

              {/* Condition */}
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="w-full sm:w-[140px] bg-background">
                  <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Conditions</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range */}
              <Flatpickr
                className="border rounded-md px-3 py-2 text-sm bg-background text-foreground w-full sm:w-[200px]"
                placeholder="Date range"
                options={{
                  mode: "range",
                  dateFormat: "Y-m-d",
                }}
                value={range}
                onChange={(dates) => setRange(dates as Date[])}
              />

              {/* Reset & Refresh */}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="w-full sm:w-auto flex items-center gap-2"
                  disabled={isLoadingAnalytics}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isLoadingAnalytics ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPI
          title="Total Assets"
          value={dashboardStats?.total ?? 0}
          icon={<Laptop />}
          colorIndex={0}
          isLoading={isLoadingAnalytics}
        />

        <KPI
          title="Assigned"
          value={dashboardStats?.assigned ?? 0}
          icon={<Users />}
          colorIndex={1}
          isLoading={isLoadingAnalytics}
        />

        <KPI
          title="Available"
          value={dashboardStats?.available ?? 0}
          icon={<Package />}
          colorIndex={2}
          isLoading={isLoadingAnalytics}
        />

        <KPI
          title="Under Repair"
          value={dashboardStats?.underRepair ?? 0}
          icon={<Wrench />}
          colorIndex={3}
          isLoading={isLoadingAnalytics}
        />

        <KPI
          title="Total Value"
          value={`₹${formatNumber(dashboardStats?.totalValue ?? 0)}`}
          icon={<DollarSign />}
          colorIndex={4}
          isLoading={isLoadingAnalytics}
        />
      </div>

      {/* CHARTS */}
      {error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : isLoadingAnalytics ? (
        <DashboardSkeleton />
      ) : (
        <DashboardCharts stats={dashboardStats} />
      )}
    </div>
  );
}

/** 📊 Responsive Dashboard Charts with Theme Support */
const DashboardCharts = React.memo(({ stats }: { stats: any }) => {
  const safeStats = useMemo(
    () => ({
      trendData: Array.isArray(stats?.trendData) ? stats.trendData : [],
      deptData: Array.isArray(stats?.deptData) ? stats.deptData : [],
      typeData: Array.isArray(stats?.typeData) ? stats.typeData : [],
      statusData: Array.isArray(stats?.statusData) ? stats.statusData : [],
      topEmployees: Array.isArray(stats?.topEmployees)
        ? stats.topEmployees
        : [],
      depreciation: Array.isArray(stats?.depreciation)
        ? stats.depreciation
        : [],
      total: stats?.total ?? 0,
      totalValue: stats?.totalValue ?? 0,
    }),
    [stats]
  );

  // Check if we have any data at all
  const hasData = safeStats.total > 0;

  // Sort trend data by date for better visualization
  const sortedTrendData = useMemo(() => {
    if (!safeStats.trendData.length) return [];

    return [...safeStats.trendData].sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  }, [safeStats.trendData]);

  if (!hasData) {
    return (
      <EmptyState
        message="No asset data available. Try adjusting your filters or add some assets to get started."
        icon={<PieChartIcon className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* LEFT SIDE - 2 columns on XL */}
      <div className="xl:col-span-2 space-y-6">
        {/* Purchase Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Purchase Trend</CardTitle>
              <CardDescription>Monthly purchases overview</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {!hasData || safeStats.trendData.length === 0 ? (
              <EmptyState message="No purchase data available" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={sortedTrendData}>
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
                    interval="preserveStartEnd"
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
            )}
          </CardContent>
        </Card>

        {/* Department & Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Assets by Department
              </CardTitle>
              <CardDescription>Breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={safeStats.deptData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                    {safeStats.deptData.map((item: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={KPI_COLORS[index % KPI_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Type Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Asset Types</CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              {!hasData || safeStats.typeData.length === 0 ? (
                <EmptyState message="No asset type data available" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={safeStats.typeData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        labelLine={false}
                        label={false}
                      >
                        {safeStats.typeData.map((_: any, i: number) => (
                          <Cell
                            key={i}
                            fill={KPI_COLORS[i % KPI_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend below chart */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {safeStats.typeData.map((item: any, i: number) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            background: KPI_COLORS[i % KPI_COLORS.length],
                          }}
                        />
                        <div className="text-xs sm:text-sm truncate">
                          {item.name} ({item.count})
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Department Value Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Value Overview</CardTitle>
            <CardDescription>Compare value vs asset count</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasData || safeStats.deptData.length === 0 ? (
              <EmptyState message="No department overview data available" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart
                  data={safeStats.deptData.map((d: any) => ({
                    ...d,
                    value: Math.round(
                      (((d.count || 0) / (safeStats.total || 1)) *
                        (safeStats.totalValue || 0)) /
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
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10B981"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    barSize={28}
                    fill="#6366F1"
                    radius={[6, 6, 0, 0]}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="#10B98133"
                    fillOpacity={0.4}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SIDE - 1 column on XL */}
      <div className="space-y-6">
        {/* Asset Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Asset Status</CardTitle>
            <CardDescription>Availability & health</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={safeStats.statusData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {safeStats.statusData.map((_: any, i: number) => (
                    <Cell key={i} fill={KPI_COLORS[i % KPI_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, "Count"]}
                  content={<CustomTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-3 mt-4">
              {safeStats.statusData.map((s: any, i: number) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: KPI_COLORS[i % KPI_COLORS.length],
                      }}
                    />
                    <div className="text-sm font-medium text-foreground">
                      {s.name}
                    </div>
                  </div>
                  <div className="font-bold text-lg text-foreground">
                    {s.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Depreciation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">
              Depreciation Snapshot
            </CardTitle>
            <CardDescription>Current vs original values</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={safeStats.depreciation}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${formatNumber(value as number)}`,
                    "Value",
                  ]}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {safeStats.depreciation.map((_: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={KPI_COLORS[index % KPI_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Depreciation Summary */}
            <div className="grid grid-cols-1 gap-2 mt-4">
              {safeStats.depreciation.map((item: any, i: number) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium text-foreground">
                    {item.name}:
                  </span>
                  <span className="font-bold text-foreground">
                    ₹{formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Employees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Top Employees</CardTitle>
            <CardDescription>Most assigned assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {safeStats.topEmployees.map((e: any, index: number) => (
              <div
                key={e.name}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className="h-10 w-10 border-2"
                    style={{
                      borderColor: KPI_COLORS[index % KPI_COLORS.length],
                    }}
                  >
                    <AvatarFallback
                      className="text-white font-bold text-xs"
                      style={{
                        backgroundColor: KPI_COLORS[index % KPI_COLORS.length],
                      }}
                    >
                      {(e.name || "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm text-foreground">
                      {e.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {e.count} asset{e.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-lg text-foreground">
                  {e.count}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

// Enhanced Loading Skeleton Component with explicit theme support
const DashboardSkeleton = React.memo(() => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2 space-y-6">
      {/* Purchase Trend Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 dark:bg-muted bg-gray-200 animate-pulse rounded" />
          <Skeleton className="h-4 w-48 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full dark:bg-muted bg-gray-200 animate-pulse rounded-md" />
        </CardContent>
      </Card>

      {/* Department & Type Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 dark:bg-muted bg-gray-200 animate-pulse rounded" />
            <Skeleton className="h-4 w-36 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full dark:bg-muted bg-gray-200 animate-pulse rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 dark:bg-muted bg-gray-200 animate-pulse rounded" />
            <Skeleton className="h-4 w-40 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full dark:bg-muted bg-gray-200 animate-pulse rounded-md" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="h-5 w-full dark:bg-muted bg-gray-200 animate-pulse rounded"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Value Overview Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 dark:bg-muted bg-gray-200 animate-pulse rounded" />
          <Skeleton className="h-4 w-56 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full dark:bg-muted bg-gray-200 animate-pulse rounded-md" />
        </CardContent>
      </Card>
    </div>

    {/* Right Side Skeleton */}
    <div className="space-y-6">
      {/* Asset Status Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 dark:bg-muted bg-gray-200 animate-pulse rounded" />
          <Skeleton className="h-4 w-40 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full dark:bg-muted bg-gray-200 animate-pulse rounded-md" />
          <div className="space-y-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-12 w-full dark:bg-muted bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Depreciation Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 dark:bg-muted bg-gray-200 animate-pulse rounded" />
          <Skeleton className="h-4 w-48 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full dark:bg-muted bg-gray-200 animate-pulse rounded-md" />
          <div className="space-y-2 mt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-6 w-full dark:bg-muted bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Employees Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 dark:bg-muted bg-gray-200 animate-pulse rounded" />
          <Skeleton className="h-4 w-40 mt-2 dark:bg-muted bg-gray-200 animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full dark:bg-muted bg-gray-200 animate-pulse" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 dark:bg-muted bg-gray-200 animate-pulse rounded" />
                  <Skeleton className="h-3 w-16 dark:bg-muted bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
              <Skeleton className="h-5 w-8 dark:bg-muted bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
));

DashboardCharts.displayName = "DashboardCharts";
DashboardSkeleton.displayName = "DashboardSkeleton";
