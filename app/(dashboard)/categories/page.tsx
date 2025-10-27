"use client";

import { useMemo, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tag,
  Package,
  TrendingUp,
  Search,
  Download,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { fetchProductsAsync } from "@/lib/store/slices/productSlice";

// -------------------------
// Export utilities (CSV, Excel, PDF)
// -------------------------
const exportCategoriesCSV = (
  data: any[],
  filename: string = "categories.csv"
) => {
  const headers = [
    "Category",
    "Products",
    "Total Stock",
    "Total Value",
    "Low Stock Items",
  ];
  const rows = data.map((cat) => [
    cat.category,
    cat.count,
    cat.totalStock,
    cat.totalValue.toFixed(2),
    cat.lowStock,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
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

const exportCategoriesExcel = (
  data: any[],
  filename: string = "categories.xlsx"
) => {
  const headers = [
    "Category",
    "Products",
    "Total Stock",
    "Total Value",
    "Low Stock Items",
  ];
  const rows = data.map((cat) => [
    cat.category,
    cat.count,
    cat.totalStock,
    cat.totalValue.toFixed(2),
    cat.lowStock,
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

const exportCategoriesPDF = (
  data: any[],
  filename: string = "categories.pdf"
) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Categories Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f0f0f0; padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { margin-bottom: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Categories Report</h1>
      <div class="summary">
        <p><strong>Total Categories:</strong> ${data.length}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Category</th>
            <th>Products</th>
            <th>Total Stock</th>
            <th>Total Value</th>
            <th>Low Stock</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (cat, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${cat.category}</td>
              <td>${cat.count}</td>
              <td>${cat.totalStock.toLocaleString()}</td>
              <td>$${cat.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</td>
              <td>${cat.lowStock}</td>
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

// -------------------------
// Skeleton Component
// -------------------------
const CardSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="border-slate-200 dark:border-slate-800 rounded-lg bg-gray-200 dark:bg-gray-700 h-48"
      />
    ))}
  </div>
);

// -------------------------
// Main CategoriesPage Component
// -------------------------
export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count" | "value">("count");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch products on mount
  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProductsAsync());
  }, [dispatch, products]);

  // Compute category stats
  const categoryStats = useMemo(() => {
    const stats = new Map<
      string,
      {
        count: number;
        totalStock: number;
        totalValue: number;
        lowStock: number;
      }
    >();

    products.forEach((product) => {
      const current = stats.get(product.category) || {
        count: 0,
        totalStock: 0,
        totalValue: 0,
        lowStock: 0,
      };

      stats.set(product.category, {
        count: current.count + 1,
        totalStock: current.totalStock + product.quantity,
        totalValue: current.totalValue + product.price * product.quantity,
        lowStock: current.lowStock + (product.quantity < 20 ? 1 : 0),
      });
    });

    let result = Array.from(stats.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));

    // Filter by search term
    if (searchTerm) {
      result = result.filter((cat) =>
        cat.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      if (sortBy === "name") {
        aVal = a.category;
        bVal = b.category;
      } else if (sortBy === "count") {
        aVal = a.count;
        bVal = b.count;
      } else if (sortBy === "value") {
        aVal = a.totalValue;
        bVal = b.totalValue;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [products, searchTerm, sortBy, sortDirection]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return categoryStats.slice(startIndex, startIndex + itemsPerPage);
  }, [categoryStats, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(categoryStats.length / itemsPerPage);

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1">
          Overview of product categories and their statistics
        </p>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" title="Export categories">
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
                  exportCategoriesCSV(
                    categoryStats,
                    `categories-${new Date().toISOString().split("T")[0]}.csv`
                  );
                  toast.success("✅ Categories exported to CSV");
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>CSV (Spreadsheet)</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  exportCategoriesExcel(
                    categoryStats,
                    `categories-${new Date().toISOString().split("T")[0]}.xlsx`
                  );
                  toast.success("✅ Categories exported to Excel");
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Excel (Report)</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  exportCategoriesPDF(
                    categoryStats,
                    `categories-${new Date().toISOString().split("T")[0]}.pdf`
                  );
                  toast.success("✅ Opening PDF preview");
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>PDF (Print)</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {categoryStats.length} categories
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Sort by:</span>
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: any) => {
            setSortBy(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Product Count</SelectItem>
            <SelectItem value="value">Total Value</SelectItem>
            <SelectItem value="name">Category Name</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
          }
        >
          {sortDirection === "asc" ? "↑ Ascending" : "↓ Descending"}
        </Button>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <CardSkeleton />
      ) : categoryStats.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedCategories.map((category) => (
            <Card
              key={category.category}
              className="border-slate-200 dark:border-slate-800"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Tag className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    </div>
                    <CardTitle className="text-lg">
                      {category.category}
                    </CardTitle>
                  </div>
                  {category.lowStock > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {category.lowStock} Low
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </div>
                  <span className="font-semibold">{category.count}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Total Stock</span>
                  </div>
                  <span className="font-semibold">
                    {category.totalStock.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-muted-foreground">
                    Total Value
                  </span>
                  <span className="font-bold text-lg">
                    $
                    {category.totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="py-12 text-center">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No categories found</CardTitle>
            <CardDescription>
              Add some products to see category statistics
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {categoryStats.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left: Items per page */}
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>

              {/* Center: Showing info */}
              <div className="flex-1 text-left text-sm text-muted-foreground whitespace-nowrap">
                {`Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                  currentPage * itemsPerPage,
                  categoryStats.length
                )} of ${categoryStats.length} assets`}
              </div>

              {/* Right: Pagination buttons */}
              <div className="flex items-center justify-end gap-2 min-w-[200px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 5) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, idx, arr) => (
                      <div key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
