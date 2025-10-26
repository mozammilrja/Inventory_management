"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/store/slices/productSlice";
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
import { Search, Plus, ArrowUpDown, Edit, Trash2, X, Filter, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, FileText, ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { deleteProductAsync } from "@/lib/store/slices/productSlice";
import { toast } from "sonner";
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
import {
  DEPARTMENTS,
  ASSET_TYPES,
  ASSET_STATUS,
  ASSET_CONDITION,
  STATUS_COLORS,
  CONDITION_COLORS,
  DEPARTMENT_COLORS,
} from "@/lib/constants";

interface ProductTableProps {
  products: Product[];
}

// Export utility functions
const exportToCSV = (data: Product[], filename: string = "assets.csv") => {
  const headers = [
    "Asset Name",
    "Type",
    "Serial Number",
    "Brand",
    "Model",
    "SKU",
    "Status",
    "Condition",
    "Employee Name",
    "Employee ID",
    "Employee Email",
    "Department",
    "Assignment Date",
    "Return Date",
    "Purchase Date",
    "Warranty Expiry",
    "Location",
    "Price",
    "Description",
    "Notes",
  ];

  const rows = data.map((product) => [
    product.name || "",
    product.assetType || "",
    product.serialNumber || "",
    product.brand || "",
    product.productModel || "",
    product.sku || "",
    product.status || "",
    product.condition || "",
    product.employeeName || "",
    product.employeeId || "",
    product.employeeEmail || "",
    product.department || "",
    product.assignmentDate ? new Date(product.assignmentDate).toLocaleDateString() : "",
    product.returnDate ? new Date(product.returnDate).toLocaleDateString() : "",
    product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString() : "",
    product.warrantyExpiry ? new Date(product.warrantyExpiry).toLocaleDateString() : "",
    product.location || "",
    product.price || "",
    product.description || "",
    product.notes || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          const cellStr = String(cell);
          return cellStr.includes(",") || cellStr.includes('"')
            ? `"${cellStr.replace(/"/g, '""')}"`
            : cellStr;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToExcel = (data: Product[], filename: string = "assets.xlsx") => {
  // Simple Excel export using CSV format (can be opened in Excel)
  const headers = [
    "Asset Name",
    "Type",
    "Serial Number",
    "Brand",
    "Model",
    "SKU",
    "Status",
    "Condition",
    "Employee Name",
    "Employee ID",
    "Employee Email",
    "Department",
    "Assignment Date",
    "Return Date",
    "Purchase Date",
    "Warranty Expiry",
    "Location",
    "Price",
    "Description",
    "Notes",
  ];

  const rows = data.map((product) => [
    product.name || "",
    product.assetType || "",
    product.serialNumber || "",
    product.brand || "",
    product.productModel || "",
    product.sku || "",
    product.status || "",
    product.condition || "",
    product.employeeName || "",
    product.employeeId || "",
    product.employeeEmail || "",
    product.department || "",
    product.assignmentDate ? new Date(product.assignmentDate).toLocaleDateString() : "",
    product.returnDate ? new Date(product.returnDate).toLocaleDateString() : "",
    product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString() : "",
    product.warrantyExpiry ? new Date(product.warrantyExpiry).toLocaleDateString() : "",
    product.location || "",
    product.price || "",
    product.description || "",
    product.notes || "",
  ]);

  const excelContent = [
    headers.join("\t"),
    ...rows.map((row) => row.join("\t")),
  ].join("\n");

  const blob = new Blob([excelContent], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = (data: Product[], filename: string = "assets.pdf") => {
  // Create a simple HTML table and print to PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>IT Assets Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f0f0f0; padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { margin-bottom: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>IT Assets Report</h1>
      <div class="summary">
        <p><strong>Total Assets:</strong> ${data.length}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Type</th>
            <th>Serial Number</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Condition</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Location</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (product) => `
            <tr>
              <td>${product.name || ""}</td>
              <td>${product.assetType || ""}</td>
              <td>${product.serialNumber || ""}</td>
              <td>${product.brand || ""}</td>
              <td>${product.status || ""}</td>
              <td>${product.condition || ""}</td>
              <td>${product.employeeName || "Unassigned"}</td>
              <td>${product.department || ""}</td>
              <td>${product.location || ""}</td>
              <td>$${product.price || 0}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open("", "", "height=600,width=800");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
};

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Product>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search across multiple fields
      const matchesSearch =
        searchTerm === "" ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productModel?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by department
      const matchesDepartment =
        departmentFilter === "all" || product.department === departmentFilter;

      // Filter by asset type
      const matchesAssetType =
        assetTypeFilter === "all" || product.assetType === assetTypeFilter;

      // Filter by status
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      // Filter by condition
      const matchesCondition =
        conditionFilter === "all" || product.condition === conditionFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesAssetType &&
        matchesStatus &&
        matchesCondition
      );
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;

      // Handle Date fields
      if (aVal && bVal && typeof aVal === "object" && typeof bVal === "object" && "getTime" in aVal && "getTime" in bVal) {
        return ((aVal as any).getTime() - (bVal as any).getTime()) * modifier;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * modifier;
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * modifier;
      }
      return 0;
    });

    return filtered;
  }, [
    products,
    searchTerm,
    departmentFilter,
    assetTypeFilter,
    statusFilter,
    conditionFilter,
    sortField,
    sortDirection,
  ]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredAndSortedProducts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await dispatch(deleteProductAsync(deleteProductId)).unwrap();
      toast.success("Product deleted successfully");
      setDeleteProductId(null);
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setAssetTypeFilter("all");
    setStatusFilter("all");
    setConditionFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    departmentFilter !== "all" ||
    assetTypeFilter !== "all" ||
    statusFilter !== "all" ||
    conditionFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, serial, employee, brand..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  title="Export assets"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    exportToCSV(filteredAndSortedProducts, `assets-${new Date().toISOString().split('T')[0]}.csv`);
                    toast.success("✅ Assets exported to CSV");
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>CSV (Spreadsheet)</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    exportToExcel(filteredAndSortedProducts, `assets-${new Date().toISOString().split('T')[0]}.xlsx`);
                    toast.success("✅ Assets exported to Excel");
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>Excel (Report)</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    exportToPDF(filteredAndSortedProducts, `assets-${new Date().toISOString().split('T')[0]}.pdf`);
                    toast.success("✅ Opening PDF preview");
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>PDF (Print)</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {filteredAndSortedProducts.length} assets selected
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => router.push("/products/new")}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
          </div>

          <Select
            value={departmentFilter}
            onValueChange={(value) => {
              setDepartmentFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
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
            onValueChange={(value) => {
              setAssetTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Asset Types</SelectItem>
              {ASSET_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
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
            onValueChange={(value) => {
              setConditionFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
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
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {filteredAndSortedProducts.length} of {products.length}{" "}
              assets
            </span>
          </div>
        )}
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="hover:bg-transparent"
                >
                  Asset Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => {
                // Check if product was created in the last 24 hours
                const isNew = product.createdAt &&
                  new Date().getTime() - new Date(product.createdAt).getTime() < 24 * 60 * 60 * 1000;

                return (
                <TableRow key={product.id} className={isNew ? "bg-green-50 dark:bg-green-950/20" : ""}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.name}</span>
                        {isNew && (
                          <Badge className="bg-green-600 text-white text-xs">NEW</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.brand} {product.productModel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.assetType}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {product.serialNumber}
                  </TableCell>
                  <TableCell>
                    {product.employeeName ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {product.employeeName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.employeeId}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.department ? (
                      <Badge
                        variant="outline"
                        className={
                          DEPARTMENT_COLORS[product.department] ||
                          "bg-slate-100 text-slate-800"
                        }
                      >
                        {product.department}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        STATUS_COLORS[
                          product.status as keyof typeof STATUS_COLORS
                        ]
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        CONDITION_COLORS[
                          product.condition as keyof typeof CONDITION_COLORS
                        ]
                      }
                    >
                      {product.condition}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/products/${product.id}?view=true`)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/products/${product.id}`)}
                        title="Edit Asset"
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteProductId(product.id || null)}
                        title="Delete Asset"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        {/* Left side: Items per page and info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredAndSortedProducts.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedProducts.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredAndSortedProducts.length}
            </span>{" "}
            assets
          </p>
        </div>

        {/* Right side: Page navigation */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* First page button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Previous page button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {/* Show first page if not in range */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className="w-9"
                  >
                    1
                  </Button>
                  {currentPage > 4 && (
                    <span className="px-1 text-muted-foreground">...</span>
                  )}
                </>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show current page and 2 pages before and after
                  return Math.abs(page - currentPage) <= 2;
                })
                .map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-9"
                  >
                    {page}
                  </Button>
                ))}

              {/* Show last page if not in range */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-1 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-9"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            {/* Next page button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last page button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
