// import api from "@/api/axios";

// export interface ProductFilters {
//   search?: string;
//   department?: string;
//   assetType?: string;
//   status?: string;
//   condition?: string;
//   startDate?: string;
//   endDate?: string;
//   page?: number;
//   limit?: number;
//   sortBy?: string;
//   sortDirection?: string;
// }

// export interface CreateProductData {
//   name: string;
//   assetType: string;
//   serialNumber?: string;
//   brand?: string;
//   model?: string;
//   sku?: string;
//   status?: string;
//   condition?: string;
//   employeeName?: string;
//   employeeId?: string;
//   employeeEmail?: string;
//   department?: string;
//   assignmentDate?: string;
//   returnDate?: string;
//   purchaseDate?: string;
//   warrantyExpiry?: string;
//   location?: string;
//   price?: number;
//   description?: string;
//   image?: string;
//   notes?: string;
//   category?: string;
//   quantity?: number;
// }

// export interface UpdateProductData {
//   id: string;
//   name?: string;
//   assetType?: string;
//   serialNumber?: string;
//   brand?: string;
//   model?: string;
//   sku?: string;
//   status?: string;
//   condition?: string;
//   employeeName?: string;
//   employeeId?: string;
//   employeeEmail?: string;
//   department?: string;
//   assignmentDate?: string;
//   returnDate?: string;
//   purchaseDate?: string;
//   warrantyExpiry?: string;
//   location?: string;
//   price?: number;
//   description?: string;
//   image?: string;
//   notes?: string;
//   category?: string;
//   quantity?: number;
// }

// export interface Product {
//   id: string;
//   name: string;
//   assetType: string;
//   serialNumber?: string;
//   brand?: string;
//   model?: string;
//   productModel?: string;
//   sku?: string;
//   status: string;
//   condition: string;
//   employeeName?: string;
//   employeeId?: string;
//   employeeEmail?: string;
//   department?: string;
//   assignmentDate?: string;
//   returnDate?: string;
//   purchaseDate?: string;
//   warrantyExpiry?: string;
//   location?: string;
//   price: number;
//   description: string;
//   image?: string;
//   notes?: string;
//   category?: string;
//   quantity?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // Get all products with filters
// export const getProductsService = async (
//   filters: ProductFilters = {}
// ): Promise<{ success: boolean; data: Product[]; total?: number }> => {
//   try {
//     const params = new URLSearchParams();

//     // Add all filters to params
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== "") {
//         params.append(key, value.toString());
//       }
//     });

//     const res = await api.get(`/products?${params.toString()}`);
//     return res.data;
//   } catch (error: any) {
//     console.error("Get products error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to fetch products"
//     );
//   }
// };

// // Get single product by ID
// export const getProductService = async (
//   id: string
// ): Promise<{ success: boolean; data: Product }> => {
//   try {
//     const res = await api.get(`/products/${id}`);
//     return res.data;
//   } catch (error: any) {
//     console.error("Get product error:", error);
//     throw new Error(error.response?.data?.message || "Failed to fetch product");
//   }
// };

// // Create new product
// export const createProductService = async (
//   data: CreateProductData
// ): Promise<{ success: boolean; data: Product; message?: string }> => {
//   try {
//     console.log("Creating product:", data);

//     // Ensure required fields are present
//     const productData = {
//       name: data.name,
//       assetType: data.assetType,
//       serialNumber: data.serialNumber || `SN-${Date.now()}`,
//       brand: data.brand || "Unknown",
//       model: data.model || "Standard",
//       sku: data.sku || `AST-${Date.now()}`,
//       status: data.status || "Available",
//       condition: data.condition || "Good",
//       employeeName: data.employeeName || null,
//       employeeId: data.employeeId || null,
//       employeeEmail: data.employeeEmail || null,
//       department: data.department || null,
//       assignmentDate: data.assignmentDate || null,
//       purchaseDate: data.purchaseDate || null,
//       warrantyExpiry: data.warrantyExpiry || null,
//       location: data.location || null,
//       price: data.price || 0,
//       description: data.description || "",
//       image: data.image || null,
//       notes: data.notes || null,
//       category: data.category || data.assetType,
//       quantity: data.quantity || (data.status === "Available" ? 1 : 0),
//     };

//     const res = await api.post("/products", productData);
//     console.log("Product created successfully:", res.data);
//     return res.data;
//   } catch (error: any) {
//     console.error("Create product error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to create product"
//     );
//   }
// };

// // Update product
// export const updateProductService = async (
//   data: UpdateProductData
// ): Promise<{ success: boolean; data: Product; message?: string }> => {
//   try {
//     console.log("Updating product:", data);

//     const updateData = {
//       name: data.name,
//       assetType: data.assetType,
//       serialNumber: data.serialNumber,
//       brand: data.brand,
//       model: data.model,
//       sku: data.sku,
//       status: data.status,
//       condition: data.condition,
//       employeeName: data.employeeName,
//       employeeId: data.employeeId,
//       employeeEmail: data.employeeEmail,
//       department: data.department,
//       assignmentDate: data.assignmentDate,
//       purchaseDate: data.purchaseDate,
//       warrantyExpiry: data.warrantyExpiry,
//       location: data.location,
//       price: data.price,
//       description: data.description,
//       image: data.image,
//       notes: data.notes,
//       category: data.category || data.assetType,
//       quantity: data.quantity || (data.status === "Available" ? 1 : 0),
//     };

//     // Remove undefined values
//     Object.keys(updateData).forEach((key) => {
//       if (updateData[key as keyof typeof updateData] === undefined) {
//         delete updateData[key as keyof typeof updateData];
//       }
//     });

//     const res = await api.put(`/products/${data.id}`, updateData);
//     console.log("Product updated successfully:", res.data);
//     return res.data;
//   } catch (error: any) {
//     console.error("Update product error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to update product"
//     );
//   }
// };

// // Delete product
// export const deleteProductService = async (
//   id: string
// ): Promise<{ success: boolean; message?: string }> => {
//   try {
//     const res = await api.delete(`/products/${id}`);
//     return res.data;
//   } catch (error: any) {
//     console.error("Delete product error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to delete product"
//     );
//   }
// };

// // Clear products cache
// export const clearProductsCacheService = async (): Promise<{
//   success: boolean;
//   message?: string;
// }> => {
//   try {
//     const res = await api.post("/products/clear-cache");
//     return res.data;
//   } catch (error: any) {
//     console.error("Clear cache error:", error);
//     throw new Error(error.response?.data?.message || "Failed to clear cache");
//   }
// };

// // Get product statistics
// export const getProductStatsService = async (
//   filters: ProductFilters = {}
// ): Promise<any> => {
//   try {
//     const res = await getProductsService(filters);
//     return res.stats || {};
//   } catch (error: any) {
//     console.error("Get stats error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to fetch statistics"
//     );
//   }
// };

// // Quick actions
// export const assignProductService = async (
//   productId: string,
//   employeeData: {
//     employeeName: string;
//     employeeId: string;
//     employeeEmail: string;
//     department: string;
//   }
// ): Promise<{ success: boolean; data: Product; message?: string }> => {
//   try {
//     const res = await api.put(`/products/${productId}`, {
//       status: "Assigned",
//       ...employeeData,
//       assignmentDate: new Date().toISOString().split("T")[0],
//     });
//     return res.data;
//   } catch (error: any) {
//     console.error("Assign product error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to assign product"
//     );
//   }
// };

// export const returnProductService = async (
//   productId: string
// ): Promise<{ success: boolean; data: Product; message?: string }> => {
//   try {
//     const res = await api.put(`/products/${productId}`, {
//       status: "Available",
//       employeeName: null,
//       employeeId: null,
//       employeeEmail: null,
//       department: null,
//       returnDate: new Date().toISOString().split("T")[0],
//     });
//     return res.data;
//   } catch (error: any) {
//     console.error("Return product error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to return product"
//     );
//   }
// };

// export const markForRepairService = async (
//   productId: string
// ): Promise<{ success: boolean; data: Product; message?: string }> => {
//   try {
//     const res = await api.put(`/products/${productId}`, {
//       status: "Under Repair",
//       condition: "Poor",
//     });
//     return res.data;
//   } catch (error: any) {
//     console.error("Mark for repair error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to mark for repair"
//     );
//   }
// };

// export const retireProductService = async (
//   productId: string
// ): Promise<{ success: boolean; data: Product; message?: string }> => {
//   try {
//     const res = await api.put(`/products/${productId}`, {
//       status: "Retired",
//       condition: "Failed",
//     });
//     return res.data;
//   } catch (error: any) {
//     console.error("Retire product error:", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to retire product"
//     );
//   }
// };

import api from "@/api/axios";

/**************************
 * ✅ INTERFACES
 **************************/
export interface ProductFilters {
  search?: string;
  department?: string;
  assetType?: string;
  status?: string;
  condition?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface CreateProductData {
  name: string;
  assetType: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  productModel?: string;
  sku?: string;
  status?: string;
  condition?: string;
  employeeName?: string;
  employeeId?: string;
  employeeEmail?: string;
  department?: string;
  assignmentDate?: string;
  returnDate?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  location?: string;
  price?: number;
  description?: string;
  image?: string;
  notes?: string;
  category?: string;
  quantity?: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface Product {
  id: string;
  name: string;
  assetType: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  productModel?: string;
  sku?: string;
  status: string;
  condition: string;
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
  category?: string;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export interface ProductStats {
  total: number;
  available: number;
  assigned: number;
  underRepair: number;
  retired: number;
  byDepartment: Record<string, number>;
  byAssetType: Record<string, number>;
}

/**************************
 * ✅ SERVICE FUNCTIONS
 **************************/

/**
 * Get all products with filters
 */
export const getProductsService = async (
  filters: ProductFilters = {}
): Promise<ApiResponse<Product[]>> => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Get products error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

/**
 * Get single product by ID
 */
export const getProductService = async (
  id: string
): Promise<ApiResponse<Product>> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get product error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

/**
 * Create new product
 */
export const createProductService = async (
  data: CreateProductData
): Promise<ApiResponse<Product>> => {
  try {
    const productData: Partial<Product> = {
      name: data.name,
      assetType: data.assetType,
      serialNumber: data.serialNumber || `SN-${Date.now()}`,
      brand: data.brand || "Unknown",
      productModel: data.productModel ?? data.model ?? "Standard",
      sku: data.sku || `SKU-${Date.now()}`,
      status: data.status || "Available",
      condition: data.condition || "Good",
      employeeName: data.employeeName,
      employeeId: data.employeeId,
      employeeEmail: data.employeeEmail,
      department: data.department,
      assignmentDate: data.assignmentDate,
      purchaseDate: data.purchaseDate,
      warrantyExpiry: data.warrantyExpiry,
      location: data.location,
      price: data.price ?? 0,
      description: data.description ?? "",
      image: data.image,
      notes: data.notes,
      category: data.category ?? data.assetType,
      quantity: data.quantity ?? (data.status === "Available" ? 1 : 0),
    };

    const response = await api.post("/products", productData);
    return response.data;
  } catch (error: any) {
    console.error("Create product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

/**
 * Update product
 */
export const updateProductService = async (
  data: UpdateProductData
): Promise<ApiResponse<Product>> => {
  try {
    const updateData: Partial<Product> = {
      name: data.name,
      assetType: data.assetType,
      serialNumber: data.serialNumber,
      brand: data.brand,
      productModel: data.productModel ?? data.model,
      sku: data.sku,
      status: data.status,
      condition: data.condition,
      employeeName: data.employeeName,
      employeeId: data.employeeId,
      employeeEmail: data.employeeEmail,
      department: data.department,
      assignmentDate: data.assignmentDate,
      purchaseDate: data.purchaseDate,
      warrantyExpiry: data.warrantyExpiry,
      location: data.location,
      price: data.price,
      description: data.description,
      image: data.image,
      notes: data.notes,
      category: data.category ?? data.assetType,
      quantity: data.quantity,
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      const typedKey = key as keyof typeof updateData;
      if (updateData[typedKey] === undefined) {
        delete updateData[typedKey];
      }
    });

    const response = await api.put(`/products/${data.id}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error("Update product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

/**
 * Delete product
 */
export const deleteProductService = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};

/**************************
 * ✅ QUICK ACTIONS
 **************************/

export const assignProductService = async (
  productId: string,
  employeeData: {
    employeeName: string;
    employeeId: string;
    employeeEmail: string;
    department: string;
  }
): Promise<ApiResponse<Product>> => {
  try {
    const response = await api.put(`/products/${productId}`, {
      status: "Assigned",
      ...employeeData,
      assignmentDate: new Date().toISOString().split("T")[0],
    });
    return response.data;
  } catch (error: any) {
    console.error("Assign product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to assign product"
    );
  }
};

export const returnProductService = async (
  productId: string
): Promise<ApiResponse<Product>> => {
  try {
    const response = await api.put(`/products/${productId}`, {
      status: "Available",
      employeeName: null,
      employeeId: null,
      employeeEmail: null,
      department: null,
      returnDate: new Date().toISOString().split("T")[0],
    });
    return response.data;
  } catch (error: any) {
    console.error("Return product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to return product"
    );
  }
};

export const markForRepairService = async (
  productId: string
): Promise<ApiResponse<Product>> => {
  try {
    const response = await api.put(`/products/${productId}`, {
      status: "Under Repair",
      condition: "Poor",
    });
    return response.data;
  } catch (error: any) {
    console.error("Mark for repair error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to mark for repair"
    );
  }
};

export const retireProductService = async (
  productId: string
): Promise<ApiResponse<Product>> => {
  try {
    const response = await api.put(`/products/${productId}`, {
      status: "Retired",
      condition: "Failed",
    });
    return response.data;
  } catch (error: any) {
    console.error("Retire product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to retire product"
    );
  }
};

/**************************
 * ✅ UTILITY FUNCTIONS
 **************************/

export const clearProductsCacheService = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await api.post("/products/clear-cache");
    return response.data;
  } catch (error: any) {
    console.error("Clear cache error:", error);
    throw new Error(error.response?.data?.message || "Failed to clear cache");
  }
};

export const getProductStatsService = async (
  filters: ProductFilters = {}
): Promise<ProductStats> => {
  try {
    // This would typically call a dedicated stats endpoint
    const response = await api.get("/products/stats", { params: filters });
    return response.data;
  } catch (error: any) {
    console.error("Get stats error:", error);

    // Fallback: calculate stats from products list
    try {
      const productsResponse = await getProductsService(filters);
      const products = productsResponse.data;

      return {
        total: products.length,
        available: products.filter((p) => p.status === "Available").length,
        assigned: products.filter((p) => p.status === "Assigned").length,
        underRepair: products.filter((p) => p.status === "Under Repair").length,
        retired: products.filter((p) => p.status === "Retired").length,
        byDepartment: products.reduce((acc, product) => {
          const dept = product.department || "Unassigned";
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byAssetType: products.reduce((acc, product) => {
          const type = product.assetType;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (fallbackError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
};

/**
 * Bulk update products
 */
export const bulkUpdateProductsService = async (
  productIds: string[],
  updateData: Partial<Product>
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.put("/products/bulk-update", {
      productIds,
      updateData,
    });
    return response.data;
  } catch (error: any) {
    console.error("Bulk update error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to bulk update products"
    );
  }
};

/**
 * Export products to CSV
 */
export const exportProductsService = async (
  filters: ProductFilters = {}
): Promise<Blob> => {
  try {
    const response = await api.get("/products/export", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    console.error("Export products error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to export products"
    );
  }
};
