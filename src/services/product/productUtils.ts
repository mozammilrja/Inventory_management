// services/productUtils.ts
import { Product, ProductFormData } from "@/types/product";
import {
  createProductService,
  updateProductService,
  assignProductService,
  returnProductService,
  markForRepairService,
  retireProductService,
  clearProductsCacheService,
  getProductStatsService,
} from "./productService";

// Create product
export const createProduct = async (
  data: ProductFormData
): Promise<Product> => {
  try {
    const response: any = await createProductService(data);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || "Failed to create product");
  } catch (error: any) {
    throw new Error(error.message || "Failed to create product");
  }
};

export const updateProduct = async (
  data: { id: string } & Partial<Product>
): Promise<Product> => {
  try {
    const { id, ...updateData } = data;

    // Convert null → undefined for API
    const sanitizedData = Object.fromEntries(
      Object.entries(updateData).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    );

    const response: any = await updateProductService({
      id,
      ...sanitizedData,
    });

    if (response.success) return response.data;

    throw new Error(response.message || "Failed to update product");
  } catch (error: any) {
    throw new Error(error.message || "Failed to update product");
  }
};

// Quick actions
export const assignProduct = async (
  productId: string,
  employeeData: {
    employeeName: string;
    employeeId: string;
    employeeEmail: string;
    department: string;
  }
): Promise<Product> => {
  try {
    const response: any = await assignProductService(productId, employeeData);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || "Failed to assign product");
  } catch (error: any) {
    throw new Error(error.message || "Failed to assign product");
  }
};

export const returnProduct = async (productId: string): Promise<Product> => {
  try {
    const response: any = await returnProductService(productId);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || "Failed to return product");
  } catch (error: any) {
    throw new Error(error.message || "Failed to return product");
  }
};

export const markForRepair = async (productId: string): Promise<Product> => {
  try {
    const response: any = await markForRepairService(productId);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || "Failed to mark product for repair");
  } catch (error: any) {
    throw new Error(error.message || "Failed to mark product for repair");
  }
};

export const retireProduct = async (productId: string): Promise<Product> => {
  try {
    const response: any = await retireProductService(productId);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || "Failed to retire product");
  } catch (error: any) {
    throw new Error(error.message || "Failed to retire product");
  }
};

// Clear cache
export const clearCache = async (): Promise<{
  message: string;
  cacheSizeBefore: number;
}> => {
  try {
    const response: any = await clearProductsCacheService();
    if (response.success) {
      return response;
    }
    throw new Error(response.error || "Failed to clear cache");
  } catch (error: any) {
    throw new Error(error.message || "Failed to clear cache");
  }
};

// Get stats
export const getStats = async (filters?: any) => {
  try {
    return await getProductStatsService(filters);
  } catch (error: any) {
    throw new Error(error.message || "Failed to get stats");
  }
};
