
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
// import { fetchProductsAsync } from "@/lib/store/slices/productSlice";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import "flatpickr/dist/flatpickr.min.css"; // required
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   RadialBarChart,
//   RadialBar,
//   Legend,
//   CartesianGrid,
//   ComposedChart,
// } from "recharts";

// import { Laptop, CheckCircle, Package, Wrench, DollarSign, Users } from "lucide-react";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_blue.css";

// const KPI_COLORS = ["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EC4899"];

// export default function DashboardPage() {
//   const dispatch = useAppDispatch();
//   const { products } = useAppSelector((s) => s.product);

//   const [query, setQuery] = useState("");
//   const [dept, setDept] = useState<string>("All");
//   const [range, setRange] = useState<Date[]>([]);
//   const [tab, setTab] = useState("overview");

//   useEffect(() => {
//     dispatch(fetchProductsAsync());
//   }, [dispatch]);

//   // FILTERING & DERIVED DATA
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return products
//       .filter((p) => (dept === "All" ? true : p.department === dept))
//       .filter((p) => {
//         if (range.length !== 2) return true;
//         const [s, e] = range;
//         if (!p.purchaseDate) return false;
//         const d = new Date(p.purchaseDate);
//         return d >= s && d <= e;
//       })
//       .filter((p) => {
//         if (!q) return true;
//         return (
//           p.name?.toLowerCase().includes(q) ||
//           p.sku?.toLowerCase().includes(q) ||
//           p.serialNumber?.toLowerCase().includes(q) ||
//           p.employeeName?.toLowerCase().includes(q)
//         );
//       });
//   }, [products, dept, range, query]);

//   const stats = useMemo(() => {
//     const total = filtered.length;
//     const byStatus = filtered.reduce((acc: Record<string, number>, p) => {
//       acc[p.status] = (acc[p.status] || 0) + 1;
//       return acc;
//     }, {});
//     const byDept = filtered.reduce((acc: Record<string, number>, p) => {
//       if (!p.department) return acc;
//       acc[p.department] = (acc[p.department] || 0) + 1;
//       return acc;
//     }, {});
//     const byType = filtered.reduce((acc: Record<string, number>, p) => {
//       acc[p.assetType || p.category || "Other"] = (acc[p.assetType || p.category || "Other"] || 0) + 1;
//       return acc;
//     }, {});

//     const totalValue = filtered.reduce((s, p) => s + (p.price || 0), 0);

//     // purchase trend (month-year)
//     const trend = filtered.reduce((acc: Record<string, number>, p) => {
//       if (!p.purchaseDate) return acc;
//       const d = new Date(p.purchaseDate);
//       const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
//       acc[key] = (acc[key] || 0) + 1;
//       return acc;
//     }, {});

//     const trendData = Object.entries(trend)
//       .map(([month, count]) => ({ month, count }))
//       .sort((a, b) => {
//         // sort by month-year ascending
//         const [mA, yA] = a.month.split(" ");
//         const [mB, yB] = b.month.split(" ");
//         return new Date(`${mA} 1, ${yA}`).getTime() - new Date(`${mB} 1, ${yB}`).getTime();
//       });

//     const deptData = Object.entries(byDept).map(([name, count]) => ({ name, count }));
//     const typeData = Object.entries(byType).map(([name, count]) => ({ name, count }));
//     const statusData = Object.entries(byStatus).map(([name, count]) => ({ name, count }));

//     // Top employees
//     const byEmp = filtered.reduce((acc: Record<string, number>, p) => {
//       if (!p.employeeName) return acc;
//       acc[p.employeeName] = (acc[p.employeeName] || 0) + 1;
//       return acc;
//     }, {});
//     const topEmployees = Object.entries(byEmp)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 6);

//     // Depreciation (simple: 20% per year)
//     const depreciation = filtered
//       .filter((p) => p.purchaseDate && p.price)
//       .map((p) => {
//         const years = (Date.now() - new Date(p.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
//         const current = Math.round(p.price * Math.pow(0.8, years));
//         return { name: p.name, original: p.price, current };
//       })
//       .slice(0, 12);

//     return { total, totalValue, trendData, deptData, typeData, statusData, topEmployees, depreciation };
//   }, [filtered]);

//   const uniqueDepts = useMemo(() => Array.from(new Set(products.map((p) => p.department).filter(Boolean))), [products]);

//   // helper small components inside file for brevity
//   const KPI = ({ title, value, icon, colorIndex = 0 }: { title: string; value: any; icon?: React.ReactNode; colorIndex?: number }) => (
//     <Card className="p-4 shadow-md border-0 bg-gradient-to-br from-white/60 to-slate-50/40 dark:from-slate-900/60 dark:to-slate-800/40 backdrop-blur-md">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <div className="text-xs font-medium text-muted-foreground">{title}</div>
//           <div className="mt-2 text-2xl font-semibold">{value}</div>
//         </div>
//         <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ background: `${KPI_COLORS[colorIndex]}22` }}>
//           {icon}
//         </div>
//       </div>
//     </Card>
//   );

//  return (
//   <div className="space-y-6 p-6">
//     {/* HEADER */}
//     <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//       <div>
//         <h2 className="text-3xl font-bold">Assets Dashboard</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Beautiful shadcn-styled analytics for your inventory
//         </p>
//       </div>

//       <div className="flex items-center gap-3 w-full md:w-auto">
//         {/* <Input
//           placeholder="Search assets, serial, employee..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="min-w-[220px]"
//         /> */}

//         <Select value={dept} onValueChange={setDept}>
//           <SelectTrigger className="w-[160px]">
//             <SelectValue placeholder="All Departments" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">All Departments</SelectItem>
//             {uniqueDepts.map((d) => (
//               <SelectItem key={d} value={d}>
//                 {d}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//     <Flatpickr
//       className="border rounded-md px-3 py-2 text-sm bg-background text-foreground"
//       placeholder="Date range"
//       options={{
//         mode: "range",
//         dateFormat: "Y-m-d",
//       }}
//       value={range}
//       onChange={(dates) => setRange(dates as Date[])}
//     />

//         <Button
//           variant="ghost"
//           onClick={() => {
//             setDept("All");
//             setRange([]);
//             setQuery("");
//           }}
//         >
//           Reset
//         </Button>
//       </div>
//     </div>

//     {/* KPIs */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//       <KPI
//         title="Total Assets"
//         value={stats.total}
//         icon={<Laptop className="h-5 w-5 text-blue-600" />}
//         colorIndex={0}
//       />
//       <KPI
//         title="Assigned"
//         value={
//           stats.statusData.find((s) => s.name === "Assigned")?.count || 0
//         }
//         icon={<CheckCircle className="h-5 w-5 text-green-600" />}
//         colorIndex={1}
//       />
//       <KPI
//         title="Available"
//         value={
//           stats.statusData.find((s) => s.name === "Available")?.count || 0
//         }
//         icon={<Package className="h-5 w-5 text-sky-600" />}
//         colorIndex={2}
//       />
//       <KPI
//         title="Under Repair"
//         value={
//           stats.statusData.find((s) => s.name === "Under Repair")?.count || 0
//         }
//         icon={<Wrench className="h-5 w-5 text-amber-500" />}
//         colorIndex={3}
//       />
//       <KPI
//         title="Total Value"
//         value={`$${Number(stats.totalValue || 0).toLocaleString()}`}
//         icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
//         colorIndex={4}
//       />
//     </div>

//     {/* MAIN DASHBOARD GRID */}
//     <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
//       {/* LEFT COLUMN */}
//       <div className="xl:col-span-2 space-y-6">
//         {/* Purchase Trend */}
//         <Card>
//           <CardHeader className="flex items-center justify-between">
//             <CardTitle>Purchase Trend</CardTitle>
//             <CardDescription>Monthly purchases overview</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={260}>
//               <AreaChart data={stats.trendData}>
//                 <defs>
//                   <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
//                     <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="count"
//                   stroke="#2563EB"
//                   fill="url(#trendFill)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Department & Type Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Assets by Department */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Assets by Department</CardTitle>
//               <CardDescription>Breakdown by department</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={stats.deptData}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Asset Types */}
//         <Card className="relative overflow-hidden">
//   <CardHeader>
//     <CardTitle>Asset Types</CardTitle>
//     <CardDescription>Distribution by type</CardDescription>
//   </CardHeader>

//   <CardContent>
//     <div className="flex justify-center items-center">
//       <ResponsiveContainer width="90%" height={240}>
//         <PieChart>
//           {/* Inner smaller pie (background layer) */}
//           <Pie
//             data={stats.typeData}
//             dataKey="count"
//             nameKey="name"
//             outerRadius={55}
//             innerRadius={35}
//             isAnimationActive={false}
//           >
//             {stats.typeData.map((_, i) => (
//               <Cell
//                 key={`inner-${i}`}
//                 fill={KPI_COLORS[i % KPI_COLORS.length]}
//                 opacity={0.5} // lighter background layer
//               />
//             ))}
//           </Pie>

//           {/* Outer pie (main visible layer) */}
//           <Pie
//             data={stats.typeData}
//             dataKey="count"
//             nameKey="name"
//             outerRadius={90}
//             innerRadius={60}
//             labelLine={false}
//             label={({ name, percent }) =>
//               `${name} ${(percent * 100).toFixed(0)}%`
//             }
//           >
//             {stats.typeData.map((_, i) => (
//               <Cell
//                 key={`outer-${i}`}
//                 fill={KPI_COLORS[i % KPI_COLORS.length]}
//               />
//             ))}
//           </Pie>

//           <Tooltip
//             contentStyle={{
//               borderRadius: "10px",
//               border: "none",
//               boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   </CardContent>
// </Card>

//         </div>

//         {/* Department Value vs Count */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Department Value Overview</CardTitle>
//             <CardDescription>Compare value vs asset count</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {stats?.deptData?.length ? (
//               <ResponsiveContainer width="100%" height={260}>
//                 <ComposedChart
//                   data={stats.deptData.map((d) => ({
//                     ...d,
//                     value: Math.round(
//                       ((d.count || 0) / (stats.total || 1)) *
//                         (stats.totalValue || 0) /
//                         10
//                     ),
//                   }))}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     fill="#34D39966"
//                     stroke="#10B981"
//                   />
//                   <Bar dataKey="count" barSize={20} fill="#6366F1" />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex items-center justify-center h-[260px] text-muted-foreground">
//                 No data available
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* RIGHT COLUMN */}
//       <div className="space-y-6">
//         {/* Asset Status */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Asset Status</CardTitle>
//             <CardDescription>Availability & health</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-4">
//               <div style={{ width: 160, height: 160 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={stats.statusData}
//                       dataKey="count"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={45}
//                       outerRadius={70}
//                       paddingAngle={4}
//                     >
//                       {stats.statusData.map((entry, idx) => (
//                         <Cell
//                           key={`cell-status-${idx}`}
//                           fill={KPI_COLORS[idx % KPI_COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="flex-1">
//                 <div className="grid grid-cols-1 gap-2">
//                   {stats.statusData.map((s) => (
//                     <div
//                       key={s.name}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <span
//                           className="w-3 h-3 rounded-full"
//                           style={{
//                             background:
//                               KPI_COLORS[
//                                 stats.statusData.indexOf(s) %
//                                   KPI_COLORS.length
//                               ],
//                           }}
//                         />
//                         <div className="text-sm">{s.name}</div>
//                       </div>
//                       <div className="font-medium">{s.count}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Depreciation Snapshot */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Depreciation Snapshot</CardTitle>
//             <CardDescription>Current vs original values</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={stats.depreciation}>
//                 <XAxis dataKey="name" hide />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="current"
//                   stroke="#F59E0B"
//                   dot={false}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Top Employees */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Top Employees</CardTitle>
//             <CardDescription>Most assigned assets</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {stats.topEmployees.length === 0 && (
//               <div className="text-sm text-muted-foreground">
//                 No assignments found
//               </div>
//             )}
//             {stats.topEmployees.map((e) => (
//               <div
//                 key={e.name}
//                 className="flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-3">
//                   <Avatar>
//                     <AvatarFallback>
//                       {(e.name || "?").slice(0, 2)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <div className="font-medium">{e.name}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {e.count} assets
//                     </div>
//                   </div>
//                 </div>
//                 <div className="font-medium">{e.count}</div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   </div>
// );

// }



"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProductsAsync } from "@/lib/store/slices/productSlice";
import { motion } from "framer-motion";
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
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((s) => s.product);

  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("All");
  const [range, setRange] = useState<Date[]>([]);

  // Fetch products only once
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  /** 🔍 Filtered Products (Memoized) */
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

  /** 📊 Stats Calculation (Memoized) */
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
          (Date.now() - new Date(new Date(p.purchaseDate ?? 0)
).getTime()) /
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

  /** 💡 Reusable KPI Component */
  const KPI = useCallback(
    ({
      title,
      value,
      icon,
      colorIndex = 0,
    }: {
      title: string;
      value: string | number;
      icon?: React.ReactNode;
      colorIndex?: number;
    }) => (
      <Card className="p-4 shadow-md border-0 bg-gradient-to-br from-white/60 to-slate-50/40 dark:from-slate-900/60 dark:to-slate-800/40 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              {title}
            </div>
            <div className="mt-2 text-2xl font-semibold">{value}</div>
          </div>
          <div
            className="flex items-center justify-center w-12 h-12 rounded-lg"
            style={{ background: `${KPI_COLORS[colorIndex]}22` }}
          >
            {icon}
          </div>
        </div>
      </Card>
    ),
    []
  );

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Assets Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Beautiful shadcn-styled analytics for your inventory
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-[160px]">
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
            className="border rounded-md px-3 py-2 text-sm bg-background text-foreground"
            placeholder="Date range"
            options={{ mode: "range", dateFormat: "Y-m-d" }}
            value={range}
            onChange={(dates) => setRange(dates as Date[])}
          />

          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPI
          title="Total Assets"
          value={stats.total}
          icon={<Laptop className="h-5 w-5 text-blue-600" />}
          colorIndex={0}
        />
        <KPI
          title="Assigned"
          value={stats.statusData.find((s) => s.name === "Assigned")?.count || 0}
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          colorIndex={1}
        />
        <KPI
          title="Available"
          value={stats.statusData.find((s) => s.name === "Available")?.count || 0}
          icon={<Package className="h-5 w-5 text-sky-600" />}
          colorIndex={2}
        />
        <KPI
          title="Under Repair"
          value={stats.statusData.find((s) => s.name === "Under Repair")?.count || 0}
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
          colorIndex={3}
        />
        <KPI
          title="Total Value"
          value={`$${Number(stats.totalValue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          colorIndex={4}
        />
      </div>

      {/* MAIN DASHBOARD GRID */}
      <DashboardCharts stats={stats} />
    </div>
  );
}

/** 🔧 Split chart section to isolate re-renders */
const DashboardCharts = React.memo(({ stats }: { stats: any }) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
    {/* LEFT SIDE */}
    <div className="xl:col-span-2 space-y-6">
      {/* Purchase Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Trend</CardTitle>
          <CardDescription>Monthly purchases overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.trendData}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#2563EB"
                fill="url(#trendFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Assets by Department</CardTitle>
            <CardDescription>Breakdown by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
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
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.typeData}
                  dataKey="count"
                  nameKey="name"
                  outerRadius={90}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
{stats.typeData.map(({ name }: { name: string; count: number }, i: number) => (
  <Cell key={name} fill={KPI_COLORS[i % KPI_COLORS.length]} />
))}


                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
                data={stats.deptData.map((d:any) => ({
                  ...d,
                  value: Math.round(
                    ((d.count || 0) / (stats.total || 1)) *
                      (stats.totalValue || 0) /
                      10
                  ),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="#34D39966"
                  stroke="#10B981"
                />
                <Bar dataKey="count" barSize={20} fill="#6366F1" />
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

    {/* RIGHT SIDE */}
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
                {stats.statusData.map((_:any, idx:any) => (
                  <Cell
                    key={idx}
                    fill={KPI_COLORS[idx % KPI_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {stats.statusData.map((s:any, i:any) => (
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
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#F59E0B"
                dot={false}
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
          {stats.topEmployees.map((e:any) => (
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
));
