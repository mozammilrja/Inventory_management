"use client";

import { useState, useMemo, useCallback, memo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  ArrowUpDown,
  Edit,
  Trash2,
  X,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileText,
  ChevronDown,
  Package,
  Calendar,
  Hash,
  RefreshCw,
  AlertCircle,
  Cpu,
  Users,
  ShieldAlert,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-utils";

// Constants
const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "HR",
  "Finance",
  "Marketing",
  "Operations",
  "Customs",
];
const ASSET_TYPES = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer",
  "Phone",
  "Docking Station",
  "Hardware",
];
const ASSET_STATUS = [
  "Available",
  "Assigned",
  "Under Repair",
  "Retired",
  "Under Repeal",
];
const ASSET_CONDITION = ["New", "Good", "Fair", "Poor", "Failed"];

const STATUS_COLORS: any = {
  Available:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200",
  Assigned:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200",
  "Under Repair":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200",
  Retired:
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200",
  "Under Repeal":
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200",
};

const CONDITION_COLORS: any = {
  New: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200",
  Good: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200",
  Fair: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200",
  Poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
  Failed:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
};

const DEPARTMENT_COLORS: any = {
  Engineering:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200",
  Sales:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200",
  HR: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-200",
  Finance:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200",
  Marketing:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200",
  Operations:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 border-cyan-200",
  Customs:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200",
};

interface Product {
  id?: string;
  name: string;
  assetType: string;
  serialNumber: string;
  brand: string;
  productModel: string;
  sku: string;
  status:
    | "Available"
    | "Assigned"
    | "Under Repair"
    | "Retired"
    | "Under Repeal";
  condition: "New" | "Good" | "Fair" | "Poor" | "Failed";
  employeeName?: string;
  employeeId?: string;
  employeeEmail?: string;
  department?: string;
  assignmentDate?: string;
  returnDate?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  location?: string;
  price: number;
  description: string;
  image?: string;
  notes?: string;
  category: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductTableProps {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  onRefetch: (params: URLSearchParams) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

// Skeleton Components
const TableSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {[...Array(9)].map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(9)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const KPISkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// KPI Cards Component
const KPICards = ({
  products,
  loading,
}: {
  products: Product[];
  loading?: boolean;
}) => {
  if (loading) return <KPISkeleton />;

  const totalAssets = products.length;
  const assignedAssets = products.filter((p) => p.status === "Assigned").length;
  const underRepairAssets = products.filter(
    (p) => p.status === "Under Repair" || p.status === "Under Repeal"
  ).length;
  const failedAssets = products.filter((p) => p.condition === "Failed").length;
  const assignmentRate =
    totalAssets > 0 ? (assignedAssets / totalAssets) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAssets.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            All IT assets in inventory
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {assignedAssets.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {assignmentRate.toFixed(1)}% assignment rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Under Repair</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {underRepairAssets.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Needs maintenance attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Assets</CardTitle>
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {failedAssets.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Requires replacement</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Optimized Product Row Component
const ProductRow = memo(
  ({
    product,
    onView,
    onEdit,
    onDelete,
  }: {
    product: Product;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string | null) => void;
  }) => {
    const isNew =
      product.createdAt &&
      new Date().getTime() - new Date(product.createdAt).getTime() <
        24 * 60 * 60 * 1000;

    const formatDate = (dateString?: string) => {
      if (!dateString) return "—";
      return new Date(dateString).toLocaleDateString();
    };

    const handleViewClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (product.id) {
        console.log("👁️ Viewing product:", product.id);
        onView(product.id);
      } else {
        console.error("❌ No product ID for view");
        toast.error("Cannot view: Product ID is missing");
      }
    };

    const handleEditClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (product.id) {
        console.log("✏️ Editing product:", product.id);
        onEdit(product.id);
      } else {
        console.error("❌ No product ID for edit");
        toast.error("Cannot edit: Product ID is missing");
      }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (product.id) {
        console.log("🗑️ Deleting product:", product.id);
        onDelete(product.id);
      } else {
        console.error("❌ No product ID for delete");
        toast.error("Cannot delete: Product ID is missing");
      }
    };

    return (
      <TableRow
        className={`group hover:bg-muted/50 ${
          isNew ? "bg-green-50 dark:bg-green-950/20" : ""
        }`}
      >
        <TableCell className="font-medium">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {product.name}
              </span>
              {isNew && (
                <Badge
                  variant="secondary"
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0"
                >
                  NEW
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{product.brand}</span>
              {product.productModel && <span>•</span>}
              <span>{product.productModel}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="font-medium">
            {product.assetType}
          </Badge>
        </TableCell>
        <TableCell>
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded border">
            {product.serialNumber || "N/A"}
          </code>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(product.createdAt)}</span>
          </div>
        </TableCell>
        <TableCell>
          {product.employeeName ? (
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {product.employeeName}
              </span>
              <span className="text-xs text-muted-foreground">
                {product.employeeId || "No ID"}
              </span>
            </div>
          ) : (
            <Badge
              variant="outline"
              className="text-muted-foreground border-dashed"
            >
              Unassigned
            </Badge>
          )}
        </TableCell>
        <TableCell>
          {product.department ? (
            <Badge
              variant="outline"
              className={
                DEPARTMENT_COLORS[product.department] ||
                "bg-gray-100 text-gray-800 border-gray-200"
              }
            >
              {product.department}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={STATUS_COLORS[product.status]}>
            {product.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={CONDITION_COLORS[product.condition]}
          >
            {product.condition}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex justify-end gap-1 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewClick}
              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
              title="View Details"
              disabled={!product.id}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditClick}
              className="h-8 w-8 hover:bg-green-100 hover:text-green-600"
              title="Edit Asset"
              disabled={!product.id}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
              title="Delete Asset"
              disabled={!product.id}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }
);

ProductRow.displayName = "ProductRow";

// Main ProductTable Component - SIMPLIFIED & FIXED
export function ProductTable({
  products,
  pagination,
  onRefetch,
  onDelete,
  loading = false,
  error = null,
}: ProductTableProps) {
  const router = useRouter();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  // Refs
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastParamsRef = useRef<string>("");

  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  // Build URLSearchParams from current state
  const buildParams = useCallback(
    (targetPage?: number, targetLimit?: number) => {
      const params = new URLSearchParams();

      // Add search term
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      // Add filters (only if not "all")
      if (departmentFilter !== "all")
        params.set("department", departmentFilter);
      if (assetTypeFilter !== "all") params.set("assetType", assetTypeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (conditionFilter !== "all") params.set("condition", conditionFilter);

      // Add date filters
      if (dateRange.startDate) params.set("startDate", dateRange.startDate);
      if (dateRange.endDate) params.set("endDate", dateRange.endDate);

      // Add sorting
      params.set("sortBy", sortField);
      params.set("sortDirection", sortDirection);

      // Add pagination
      params.set("page", (targetPage || page).toString());
      params.set("limit", (targetLimit || limit).toString());

      return params;
    },
    [
      searchTerm,
      departmentFilter,
      assetTypeFilter,
      statusFilter,
      conditionFilter,
      dateRange.startDate,
      dateRange.endDate,
      sortField,
      sortDirection,
      page,
      limit,
    ]
  );

  // Trigger refetch with debounce prevention
  const triggerRefetch = useCallback(
    (params: URLSearchParams, action: string) => {
      const paramsString = params.toString();

      // Prevent duplicate calls
      if (lastParamsRef.current === paramsString) {
        console.log("🔄 Skipping duplicate API call:", paramsString);
        return;
      }

      lastParamsRef.current = paramsString;
      console.log("🔄 Making API call:", paramsString, "Action:", action);

      setIsRefetching(true);
      onRefetch(params);
    },
    [onRefetch]
  );

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const params = buildParams(1); // Reset to page 1 for search
      triggerRefetch(params, "search");
    }, 500);
  };

  // Handle filter changes - reset to page 1
  const handleFilterChange = () => {
    const params = buildParams(1);
    triggerRefetch(params, "filter");
  };

  // Handle sort changes - keep current page
  const handleSortChange = () => {
    const params = buildParams();
    triggerRefetch(params, "sort");
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;

    console.log("📄 Changing to page:", newPage, "from current page:", page);
    const params = buildParams(newPage);
    triggerRefetch(params, "pagination");
  };

  // Handle limit changes
  const handleLimitChange = (newLimit: number) => {
    console.log("📄 Changing limit to:", newLimit);
    const params = buildParams(1, newLimit); // Reset to page 1
    triggerRefetch(params, "limit");
  };

  // Effects for filter changes
  useEffect(() => {
    handleFilterChange();
  }, [
    departmentFilter,
    assetTypeFilter,
    statusFilter,
    conditionFilter,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  // Effect for sort changes
  useEffect(() => {
    handleSortChange();
  }, [sortField, sortDirection]);

  const handleSort = (field: string) => {
    setSortField(field);
    setSortDirection((prev) =>
      prev === "asc" && sortField === field ? "desc" : "asc"
    );
  };

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setAssetTypeFilter("all");
    setStatusFilter("all");
    setConditionFilter("all");
    setDateRange({ startDate: "", endDate: "" });
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      searchTerm !== "" ||
      departmentFilter !== "all" ||
      assetTypeFilter !== "all" ||
      statusFilter !== "all" ||
      conditionFilter !== "all" ||
      dateRange.startDate !== "" ||
      dateRange.endDate !== "",
    [
      searchTerm,
      departmentFilter,
      assetTypeFilter,
      statusFilter,
      conditionFilter,
      dateRange.startDate,
      dateRange.endDate,
    ]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteProductId) return;
    try {
      await onDelete(deleteProductId);
      setDeleteProductId(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }, [deleteProductId, onDelete]);

  const handleEdit = (id: string) => {
    router.push(`/products/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/products/${id}`);
  };

  // Optimized export handler
  const handleExport = useCallback(
    async (format: "csv" | "excel" | "pdf") => {
      setIsExporting(true);
      const toastId = toast.loading(
        `Preparing ${format.toUpperCase()} export...`
      );

      try {
        const productsToExport = products;

        if (productsToExport.length === 0) {
          toast.error("No data to export", { id: toastId });
          return;
        }

        toast.success(
          `Exporting ${productsToExport.length.toLocaleString()} records...`,
          { id: toastId }
        );

        const filename = `assets-export-${
          new Date().toISOString().split("T")[0]
        }`;

        switch (format) {
          case "csv":
            exportToCSV(productsToExport, `${filename}.csv`);
            break;
          case "excel":
            exportToExcel(productsToExport, `${filename}.xlsx`);
            break;
          case "pdf":
            await exportToPDF(productsToExport);
            break;
        }

        toast.success(`✅ ${format.toUpperCase()} export completed!`, {
          id: toastId,
        });
      } catch (error) {
        console.error("Export error:", error);
        toast.error(`Failed to export ${format.toUpperCase()}`, {
          id: toastId,
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      } finally {
        setIsExporting(false);
      }
    },
    [products]
  );

  // Memoized pagination numbers
  const paginationNumbers = useMemo(() => {
    if (totalPages <= 1) return [];

    const numbers = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) numbers.push(i);
        numbers.push("...");
        numbers.push(totalPages);
      } else if (page >= totalPages - 3) {
        numbers.push(1);
        numbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) numbers.push(i);
      } else {
        numbers.push(1);
        numbers.push("...");
        for (let i = page - 1; i <= page + 1; i++) numbers.push(i);
        numbers.push("...");
        numbers.push(totalPages);
      }
    }

    return numbers;
  }, [page, totalPages]);

  // Reset refetching state when loading changes
  useEffect(() => {
    if (!loading) {
      setIsRefetching(false);
    }
  }, [loading]);

  // Debug: Log products to see what's being received
  useEffect(() => {
    console.log("📦 ProductTable received products:", products);
    console.log("📊 ProductTable received pagination:", pagination);
  }, [products, pagination]);

  // Error state display
  if (error && !loading && !isRefetching) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">
                Error Loading Assets
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
          <Button
            onClick={() => triggerRefetch(buildParams(), "retry")}
            className="mt-4"
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {/* <KPICards products={products} loading={loading || isRefetching} /> */}

      {/* Enhanced Search and Filters Section */}
      <div className="flex flex-col gap-4 p-1">
        {/* Search Bar with Better Design */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets by name, serial, employee, brand..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-10 h-10 w-full"
                disabled={loading || isRefetching}
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading || isRefetching}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isExporting || loading || isRefetching}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleExport("csv")}
                  disabled={isExporting || loading || isRefetching}
                  className="cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("excel")}
                  disabled={isExporting || loading || isRefetching}
                  className="cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting || loading || isRefetching}
                  className="cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => router.push("/products/new")}
              size="sm"
              disabled={loading || isRefetching}
              className="flex items-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Add Asset</span>
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                const params = buildParams(1);
                triggerRefetch(params, "refresh");
              }}
              size="sm"
              variant="outline"
              disabled={loading || isRefetching}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </div>

            {/* Date Range Filters */}
            {/* <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-[140px]"
                placeholder="Start Date"
                disabled={loading || isRefetching}
              />
              <span className="text-muted-foreground text-sm">to</span>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-[140px]"
                placeholder="End Date"
                disabled={loading || isRefetching}
              />
            </div> */}

            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
              disabled={loading || isRefetching}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={assetTypeFilter}
              onValueChange={setAssetTypeFilter}
              disabled={loading || isRefetching}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ASSET_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              disabled={loading || isRefetching}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {ASSET_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={conditionFilter}
              onValueChange={setConditionFilter}
              disabled={loading || isRefetching}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {ASSET_CONDITION.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={loading || isRefetching}
                className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && !loading && !isRefetching && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-md border border-green-200 dark:border-green-800">
              <Filter className="h-3 w-3" />
              <span>
                Showing {products.length} of {total} assets
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {(loading || isRefetching) && <TableSkeleton />}

      {/* Table Section */}
      {!loading && !isRefetching && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="font-semibold hover:bg-transparent px-0"
                      disabled={loading}
                    >
                      Asset Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Serial Number</TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("createdAt")}
                      className="font-semibold hover:bg-transparent px-0"
                      disabled={loading}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Created Date
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Assigned To</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Condition</TableHead>
                  <TableHead className="text-right font-semibold w-[140px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Package className="h-12 w-12 opacity-50" />
                        <div>
                          <p className="font-medium text-lg">No assets found</p>
                          <p className="text-sm mt-1">
                            {hasActiveFilters
                              ? "Try adjusting your search or filters"
                              : "Get started by adding your first asset"}
                          </p>
                        </div>
                        {!hasActiveFilters && (
                          <Button
                            onClick={() => router.push("/products/new")}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Asset
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={setDeleteProductId}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      {!loading && !isRefetching && products.length > 0 && totalPages > 0 && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Show</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  const newLimit = Number(value);
                  handleLimitChange(newLimit);
                }}
                disabled={loading || isRefetching}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">per page</span>
            </div>

            <span className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(page * limit, total)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {total?.toLocaleString()}
              </span>{" "}
              assets
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={page === 1 || loading || isRefetching}
                className="h-9 w-9"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading || isRefetching}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {paginationNumbers.map((p, index) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-muted-foreground"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(p as number)}
                      disabled={loading || isRefetching}
                      className="h-9 w-9"
                    >
                      {p}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading || isRefetching}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages || loading || isRefetching}
                className="h-9 w-9"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              asset and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
