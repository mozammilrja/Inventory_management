import api from "@/api/axios";

export interface CategoryFilters {
  search?: string;
  sortBy?: "name" | "count" | "value";
  sortDirection?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CategoryData {
  category: string;
  count: number;
  totalStock: number;
  totalValue: number;
  lowStock: number;
}

export interface CreateCategoryData {
  category: string;
  description?: string;
}

export interface UpdateCategoryData {
  id: string;
  category?: string;
  description?: string;
}

// Get all categories with filters
export const getCategoriesService = async (filters: CategoryFilters = {}) => {
  const params = new URLSearchParams();

  // Add all filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const res = await api.get(`/categories?${params.toString()}`);
  return res.data;
};

// Get single category by ID
export const getCategoryService = async (id: string) => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};






// Get category statistics
export const getCategoryStatsService = async (filters: CategoryFilters = {}) => {
  const res = await getCategoriesService(filters);
  return res.stats;
};

// Alternative: Get categories from products (fallback)
export const getCategoriesFromProductsService = async (filters: CategoryFilters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const res = await api.get(`/products?${params.toString()}&limit=1000`);
  
  if (res.data.success && res.data.data) {
    const products = res.data.data;
    
    // Compute category stats from products
    const categoryStats = new Map<
      string,
      {
        count: number;
        totalStock: number;
        totalValue: number;
        lowStock: number;
      }
    >();

    products.forEach((product: any) => {
      const category = product.category || product.assetType || "Uncategorized";
      const current = categoryStats.get(category) || {
        count: 0,
        totalStock: 0,
        totalValue: 0,
        lowStock: 0,
      };

      categoryStats.set(category, {
        count: current.count + 1,
        totalStock: current.totalStock + (product.quantity || 0),
        totalValue: current.totalValue + (product.price || 0) * (product.quantity || 1),
        lowStock: current.lowStock + ((product.quantity || 0) < 20 ? 1 : 0),
      });
    });

    return Array.from(categoryStats.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }
  
  throw new Error("Invalid products API response format");
};