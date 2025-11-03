import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// 🧠 Product Interface
export interface Product {
  id?: string;
  name: string;
  assetType: string;
  serialNumber: string;
  brand: string;
  productModel: string;
  sku: string;
  status: "Available" | "Assigned" | "Under Repair" | "Retired";
  condition: "New" | "Good" | "Fair" | "Poor";
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

// 🧩 API Response Interface
interface ProductsResponse {
  success: boolean;
  data: Product[];
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
  stats: {
    total: number;
    totalValue: number;
    assigned: number;
    available: number;
    underRepair: number;
    retired: number;
    statusData: { name: string; count: number }[];
    conditionData: { name: string; count: number }[];
    assetTypeData: { name: string; count: number }[];
    departmentData: { name: string; count: number }[];
    avgPrice: number;
    maxPrice: number;
    minPrice: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: {
    search: string;
    department: string;
    assetType: string;
    status: string;
    condition: string;
    startDate?: string;
    endDate?: string;
    sortBy: string;
    sortDirection: string;
  };
  metadata?: {
    timestamp: string;
    cache: string;
    executionTime: number;
  };
}

// 🧩 Dashboard Analytics Interface
export interface DashboardStats {
  total: number;
  assigned: number;
  available: number;
  underRepair: number;
  totalValue: number;
  totalAssets: number;
  deptData: { name: string; count: number }[];
  statusData: { name: string; count: number }[];
  conditionData: { name: string; count: number }[];
  trendData: { month: string; count: number }[];
  typeData: { name: string; count: number }[];
  topEmployees: { name: string; count: number }[];
  depreciation: { name: string; value: number }[];
}

// 🧩 Product Form Interface
export interface ProductFormData
  extends Omit<Product, "id" | "createdAt" | "updatedAt"> {}

// 🧩 Default Dashboard Stats
const defaultDashboardStats: DashboardStats = {
  total: 0,
  assigned: 0,
  available: 0,
  underRepair: 0,
  totalValue: 0,
  totalAssets: 0,
  deptData: [],
  statusData: [],
  conditionData: [],
  trendData: [],
  typeData: [],
  topEmployees: [],
  depreciation: [],
};

// 🧩 Default Stats
const defaultStats = {
  total: 0,
  totalValue: 0,
  assigned: 0,
  available: 0,
  underRepair: 0,
  retired: 0,
  statusData: [],
  conditionData: [],
  assetTypeData: [],
  departmentData: [],
  avgPrice: 0,
  maxPrice: 0,
  minPrice: 0,
  currentPage: 1,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPrevPage: false,
};

// 🧩 Default Pagination
const defaultPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
};

// 🧩 Add Product
export const addProductAsync = createAsyncThunk(
  "products/add",
  async (product: ProductFormData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add product");
      }

      const result = await res.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Update Product
export const updateProductAsync = createAsyncThunk(
  "products/update",
  async (product: Product, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      const result = await res.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Fetch Products with Server-Side Pagination
export const fetchProductsAsync = createAsyncThunk<
  ProductsResponse,
  URLSearchParams | undefined
>("products/fetch", async (params, { rejectWithValue }) => {
  try {
    const queryString = params ? `?${params.toString()}` : "";
    console.log("🔄 Fetching products with params:", queryString);

    const res = await fetch(`/api/products${queryString}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    console.log("📦 API Response received:", {
      success: data.success,
      productsCount: data.data?.length,
      pagination: data.pagination,
      stats: data.stats,
    });

    return data as ProductsResponse;
  } catch (error: any) {
    console.error("❌ Fetch products error:", error);
    return rejectWithValue(error.message);
  }
});

// 🧩 Delete Product
export const deleteProductAsync = createAsyncThunk(
  "products/delete",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }

      const result = await res.json();
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Fetch Dashboard Analytics
export const fetchDashboardAnalyticsAsync = createAsyncThunk<
  DashboardStats,
  string | undefined
>(
  "products/fetchDashboardAnalytics",
  async (query = "", { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/assets/analytics${query}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard analytics");
      const data = await res.json();

      return data as DashboardStats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 Clear Cache
export const clearCacheAsync = createAsyncThunk(
  "products/clearCache",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clearCache" }),
      });

      if (!res.ok) {
        throw new Error("Failed to clear cache");
      }

      const result = await res.json();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧩 State Interface
interface ProductState {
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
  stats: {
    total: number;
    totalValue: number;
    assigned: number;
    available: number;
    underRepair: number;
    retired: number;
    statusData: { name: string; count: number }[];
    conditionData: { name: string; count: number }[];
    assetTypeData: { name: string; count: number }[];
    departmentData: { name: string; count: number }[];
    avgPrice: number;
    maxPrice: number;
    minPrice: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  dashboardStats: DashboardStats;
  isLoading: boolean;
  isLoadingProducts: boolean;
  isLoadingStats: boolean;
  isLoadingAnalytics: boolean;
  error: string | null;
  lastFetch: string | null;
  filters: {
    search: string;
    department: string;
    assetType: string;
    status: string;
    condition: string;
    sortBy: string;
    sortDirection: string;
  } | null;
}

// 🧩 Initial State
const initialState: ProductState = {
  products: [],
  pagination: defaultPagination,
  stats: defaultStats,
  dashboardStats: defaultDashboardStats,
  isLoading: false,
  isLoadingProducts: false,
  isLoadingStats: false,
  isLoadingAnalytics: false,
  error: null,
  lastFetch: null,
  filters: null,
};

// 🧩 Slice Definition
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDashboardStats: (state) => {
      state.dashboardStats = defaultDashboardStats;
    },
    setPagination: (
      state,
      action: PayloadAction<ProductState["pagination"]>
    ) => {
      state.pagination = action.payload;
    },
    setFilters: (state, action: PayloadAction<ProductState["filters"]>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = null;
    },
    updateProductLocal: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    addProductLocal: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
      state.pagination.total += 1;
      state.pagination.totalPages = Math.ceil(
        state.pagination.total / state.pagination.limit
      );
    },
    deleteProductLocal: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
      state.pagination.totalPages = Math.ceil(
        state.pagination.total / state.pagination.limit
      );

      // Adjust current page if needed
      if (
        state.pagination.page > state.pagination.totalPages &&
        state.pagination.totalPages > 0
      ) {
        state.pagination.page = state.pagination.totalPages;
      }
    },
    resetProducts: (state) => {
      state.products = [];
      state.pagination = defaultPagination;
      state.stats = defaultStats;
      state.filters = null;
      state.error = null;
    },
  },
  // Replace your extraReducers section with this:

  extraReducers: (builder) => {
    builder
      // ➕ Add Product
      .addCase(addProductAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload);
        state.pagination.total += 1;
        state.pagination.totalPages = Math.ceil(
          state.pagination.total / state.pagination.limit
        );

        // Update stats
        state.stats.total += 1;
        state.stats.totalValue += action.payload.price || 0;

        // Update status count
        const status = action.payload.status;
        const statusItem = state.stats.statusData.find(
          (s) => s.name === status
        );
        if (statusItem) {
          statusItem.count += 1;
        } else {
          state.stats.statusData.push({ name: status, count: 1 });
        }
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to add product";
      })

      // ✏️ Update Product
      .addCase(updateProductAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          const oldProduct = state.products[index];
          const newProduct = action.payload;

          state.products[index] = newProduct;

          // Update stats if price changed
          if (oldProduct.price !== newProduct.price) {
            state.stats.totalValue =
              state.stats.totalValue - oldProduct.price + newProduct.price;
          }
        }
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to update product";
      })

      // 📦 Fetch Products with Server-Side Pagination (FIXED - ONLY ONE HANDLER)
      .addCase(fetchProductsAsync.pending, (state) => {
        state.isLoadingProducts = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.isLoadingProducts = false;
        state.lastFetch = new Date().toISOString();

        if (action.payload.success) {
          // Update products
          state.products = action.payload.data || [];

          // CRITICAL: Update pagination state from API response
          const apiPagination = action.payload.pagination;
          if (apiPagination) {
            state.pagination = {
              total: apiPagination.total || 0,
              page: apiPagination.page || 1,
              limit: apiPagination.limit || 10,
              totalPages: apiPagination.totalPages || 0,
              hasNextPage: apiPagination.hasNextPage || false,
              hasPrevPage: apiPagination.hasPrevPage || false,
              nextPage: apiPagination.nextPage || null,
              prevPage: apiPagination.prevPage || null,
            };
          }

          // Update stats and filters
          state.stats = action.payload.stats || defaultStats;
          state.filters = action.payload.filters || null;

          console.log("✅ Products loaded successfully:", {
            productsCount: state.products.length,
            page: state.pagination.page,
            total: state.pagination.total,
            pagination: state.pagination,
            stats: state.stats,
          });
        } else {
          state.error = "Failed to fetch products: API returned error";
          state.products = [];
          state.pagination = defaultPagination;
          state.stats = defaultStats;
        }
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.isLoadingProducts = false;
        state.error = (action.payload as string) || "Failed to fetch products";
        state.products = [];
        state.pagination = defaultPagination;
        state.stats = defaultStats;

        console.error("❌ Fetch products failed:", action.payload);
      })

      // ❌ Delete Product
      .addCase(deleteProductAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedProduct = state.products.find(
          (p) => p.id === action.payload
        );

        if (deletedProduct) {
          state.products = state.products.filter(
            (p) => p.id !== action.payload
          );
          state.pagination.total = Math.max(0, state.pagination.total - 1);
          state.pagination.totalPages = Math.ceil(
            state.pagination.total / state.pagination.limit
          );

          // Update stats
          state.stats.total -= 1;
          state.stats.totalValue = Math.max(
            0,
            state.stats.totalValue - (deletedProduct.price || 0)
          );

          // Update status count
          const status = deletedProduct.status;
          const statusItem = state.stats.statusData.find(
            (s) => s.name === status
          );
          if (statusItem && statusItem.count > 0) {
            statusItem.count -= 1;
          }

          // Adjust current page if it's beyond total pages after deletion
          if (
            state.pagination.page > state.pagination.totalPages &&
            state.pagination.totalPages > 0
          ) {
            state.pagination.page = state.pagination.totalPages;
          }
        }
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to delete product";
      })

      // 📈 Dashboard Analytics
      .addCase(fetchDashboardAnalyticsAsync.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardAnalyticsAsync.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.isLoadingAnalytics = false;
          state.error = null;

          // Validate and transform the incoming data with proper fallbacks
          const payload = action.payload || {};

          state.dashboardStats = {
            // Core metrics with validation
            total: Number(payload.total) || 0,
            assigned: Number(payload.assigned) || 0,
            available: Number(payload.available) || 0,
            underRepair: Number(payload.underRepair) || 0,
            totalValue: Number(payload.totalValue) || 0,
            totalAssets:
              Number(payload.totalAssets) || Number(payload.total) || 0,

            // Array data with validation
            deptData: Array.isArray(payload.deptData)
              ? payload.deptData.map((item: any) => ({
                  name: String(item.name || "Unknown"),
                  count: Number(item.count) || 0,
                }))
              : [],

            statusData: Array.isArray(payload.statusData)
              ? payload.statusData.map((item: any) => ({
                  name: String(item.name || "Unknown"),
                  count: Number(item.count) || 0,
                }))
              : [],

            conditionData: Array.isArray(payload.conditionData)
              ? payload.conditionData.map((item: any) => ({
                  name: String(item.name || "Unknown"),
                  count: Number(item.count) || 0,
                }))
              : [],

            trendData: Array.isArray(payload.trendData)
              ? payload.trendData.map((item: any) => ({
                  month: String(item.month || "Unknown"),
                  count: Number(item.count) || 0,
                }))
              : [],

            typeData: Array.isArray(payload.typeData)
              ? payload.typeData.map((item: any) => ({
                  name: String(item.name || "Unknown"),
                  count: Number(item.count) || 0,
                }))
              : [],

            topEmployees: Array.isArray(payload.topEmployees)
              ? payload.topEmployees.map((item: any) => ({
                  name: String(item.name || "Unknown"),
                  count: Number(item.count) || 0,
                }))
              : [],

            depreciation: Array.isArray(payload.depreciation)
              ? payload.depreciation.map((item: any) => ({
                  name: String(item.name || "Unknown"),
                  value: Number(item.value) || 0,
                }))
              : [],
          };

          console.log("📊 Dashboard analytics loaded successfully:", {
            total: state.dashboardStats.total,
            assigned: state.dashboardStats.assigned,
            available: state.dashboardStats.available,
            totalValue: state.dashboardStats.totalValue,
          });
        }
      )
      .addCase(fetchDashboardAnalyticsAsync.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error =
          (action.payload as string) || "Failed to fetch dashboard analytics";

        // Reset to default stats on error
        state.dashboardStats = defaultDashboardStats;

        console.error(
          "❌ Failed to fetch dashboard analytics:",
          action.payload
        );
      })

      // 🧹 Clear Cache
      .addCase(clearCacheAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCacheAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const { message, cacheSizeBefore } = action.payload || {};

        console.log("✅ Cache cleared successfully:", {
          message: message || "Cache cleared",
          entriesRemoved: cacheSizeBefore || 0,
        });

        // Optional: Show toast notification
        if (typeof window !== "undefined") {
          console.info(
            `🧹 Cache cleared: ${cacheSizeBefore || 0} entries removed`
          );
        }
      })
      .addCase(clearCacheAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to clear cache";

        console.error("❌ Failed to clear cache:", action.payload);

        // Optional: Show error toast
        if (typeof window !== "undefined") {
          console.error("Cache clearance failed:", action.payload);
        }
      });
  },
});

export const {
  clearError,
  resetDashboardStats,
  setPagination,
  setFilters,
  clearFilters,
  updateProductLocal,
  addProductLocal,
  deleteProductLocal,
  resetProducts,
} = productSlice.actions;

export default productSlice.reducer;
