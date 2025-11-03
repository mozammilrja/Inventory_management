"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import {
  getCategoriesService,
  getCategoriesFromProductsService,
  type CategoryData,
} from "@/services/categories/categoriesService";
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
import { CardsGridSkeleton } from "@/components/categories/CategorySkeletons";
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
  Filter,
  RefreshCw,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

// -------------------------
// Export utilities (CSV, Excel, PDF)
// -------------------------
const exportCategoriesCSV = (
  data: CategoryData[],
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
  data: CategoryData[],
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
  data: CategoryData[],
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
// Main CategoriesPage Component
// -------------------------
export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count" | "value">("count");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Use refs to track state without causing re-renders
  const isMountedRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const currentSearchTermRef = useRef(searchTerm);
  const currentSortByRef = useRef(sortBy);
  const currentSortDirectionRef = useRef(sortDirection);

  // Update refs when state changes
  useEffect(() => {
    currentSearchTermRef.current = searchTerm;
    currentSortByRef.current = sortBy;
    currentSortDirectionRef.current = sortDirection;
  }, [searchTerm, sortBy, sortDirection]);

  // Fetch categories from API service - NO DEPENDENCIES
  const fetchCategories = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Use ref values to avoid dependency on state
      const search = currentSearchTermRef.current;
      const sort = currentSortByRef.current;
      const direction = currentSortDirectionRef.current;

      console.log("Fetching categories with:", { search, sort, direction });

      // Try to fetch from categories API first, fall back to products API
      let categoriesData;
      try {
        const response: any = await getCategoriesService({
          search: search,
          sortBy: sort,
          sortDirection: direction,
        });

        if (response.success && response.data) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        } else {
          throw new Error("Invalid categories API response format");
        }
      } catch (categoriesError) {
        console.log("Categories API failed, falling back to products API");
        categoriesData = await getCategoriesFromProductsService({
          search: search,
          sortBy: sort,
          sortDirection: direction,
        });
      }

      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Error loading categories:", err);
      setError(err.message || "Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []); // EMPTY dependency array - this is the key fix

  // Load categories on component mount - ONLY ONCE
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      console.log("Initial load");
      fetchCategories();
    }
  }, [fetchCategories]);

  // Handle search and filter changes with debounce
  useEffect(() => {
    // Don't trigger on initial mount
    if (!isMountedRef.current) return;

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for API call
    searchTimeoutRef.current = setTimeout(() => {
      console.log("Debounced search/filter change");
      fetchCategories();
      setCurrentPage(1);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, sortBy, sortDirection, fetchCategories]);

  // Filter and sort categories - client-side only
  const processedCategories = useMemo(() => {
    let result = [...categories];

    // Client-side filtering
    if (searchTerm) {
      result = result.filter((cat) =>
        cat.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Client-side sorting
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
  }, [categories, searchTerm, sortBy, sortDirection]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [processedCategories, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedCategories.length / itemsPerPage);

  // Refresh handler
  const handleRefresh = () => {
    console.log("Manual refresh");
    fetchCategories(true);
    setCurrentPage(1);
  };

  // Handle sort changes
  const handleSortChange = (value: "name" | "count" | "value") => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Categories
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Overview of product categories and their statistics
            </p>
          </div>

          {/* Action Buttons - Perfectly Aligned */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center lg:justify-end">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 w-full h-10"
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons Group */}
            <div className="flex gap-2">
              {/* Refresh Button */}
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="h-10 px-3 flex items-center gap-2 border-border/50 hover:bg-muted/50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-3 flex items-center gap-2 border-border/50 hover:bg-muted/50"
                    disabled={isLoading || processedCategories.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-background border-border shadow-lg"
                >
                  <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      exportCategoriesCSV(
                        processedCategories,
                        `categories-${
                          new Date().toISOString().split("T")[0]
                        }.csv`
                      );
                      toast.success("✅ Categories exported to CSV");
                    }}
                    className="cursor-pointer flex items-center gap-2"
                    disabled={processedCategories.length === 0}
                  >
                    <FileText className="h-4 w-4" />
                    <span>CSV Format</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      exportCategoriesExcel(
                        processedCategories,
                        `categories-${
                          new Date().toISOString().split("T")[0]
                        }.xlsx`
                      );
                      toast.success("✅ Categories exported to Excel");
                    }}
                    className="cursor-pointer flex items-center gap-2"
                    disabled={processedCategories.length === 0}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Excel Format</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      exportCategoriesPDF(
                        processedCategories,
                        `categories-${
                          new Date().toISOString().split("T")[0]
                        }.pdf`
                      );
                      toast.success("✅ Opening PDF preview");
                    }}
                    className="cursor-pointer flex items-center gap-2"
                    disabled={processedCategories.length === 0}
                  >
                    <FileText className="h-4 w-4" />
                    <span>PDF Format</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    {processedCategories.length} categories
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card/50 rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Sort & Filter</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={sortBy}
                onValueChange={handleSortChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                  <SelectValue placeholder="Sort by" />
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
                onClick={handleSortDirectionChange}
                className="h-9 border-border/50 hover:bg-muted/50"
                disabled={isLoading}
              >
                {sortDirection === "asc" ? "↑ Ascending" : "↓ Descending"}
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {paginatedCategories.length} of {processedCategories.length}{" "}
            categories
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <h3 className="font-semibold text-destructive">
                    Error Loading Categories
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <CardsGridSkeleton count={itemsPerPage} />
        ) : processedCategories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCategories.map((category) => (
              <Card
                key={category.category}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle
                          className="text-lg truncate"
                          title={category.category}
                        >
                          {category.category}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {category.count} products
                        </CardDescription>
                      </div>
                    </div>
                    {category.lowStock > 0 && (
                      <Badge variant="destructive" className="shrink-0 ml-2">
                        {category.lowStock} Low
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>Total Stock</span>
                      </div>
                      <p className="text-xl font-semibold">
                        {category.totalStock.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Products</span>
                      </div>
                      <p className="text-xl font-semibold">{category.count}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total Value
                      </span>
                      <span className="text-xl font-bold text-primary">
                        $
                        {category.totalValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <Tag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <CardTitle className="mb-3 text-2xl">
                No categories found
              </CardTitle>
              <CardDescription className="text-lg">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No categories available in the system"}
              </CardDescription>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Total Categories: {processedCategories.length}</span>
            {searchTerm && (
              <>
                <span>•</span>
                <span>Search: "{searchTerm}"</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Sorted by: {sortBy}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded">
              {sortDirection === "asc" ? "↑" : "↓"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
