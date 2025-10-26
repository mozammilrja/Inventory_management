import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id?: string;
  // Asset Information
  name: string;
  assetType: string;
  serialNumber: string;
  brand: string;
  productModel: string;
  sku: string;

  // Status & Condition
  status: "Available" | "Assigned" | "Under Repair" | "Retired";
  condition: "New" | "Good" | "Fair" | "Poor";

  // Employee Assignment
  employeeName?: string;
  employeeId?: string;
  employeeEmail?: string;
  department?: string;
  assignmentDate?: string;
  returnDate?: string;

  // Dates & Warranty
  purchaseDate?: string;
  warrantyExpiry?: string;

  // Location & Value
  location?: string;
  price: number;

  // Additional Info
  description: string;
  image?: string;
  notes?: string;

  // Legacy fields
  category: string;
  quantity: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
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
}
// Add Product
export const addProductAsync = createAsyncThunk(
  "products/add",
  async (product: ProductFormData) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to add product");
    }

    return res.json() as Promise<Product>;
  },
);

// Optional: Update Product
export const updateProductAsync = createAsyncThunk(
  "products/update",
  async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update product");
    }

    return res.json() as Promise<Product>;
  },
);

// Optional: Fetch Products
export const fetchProductsAsync = createAsyncThunk(
  "products/fetch",
  async () => {
    const res = await fetch("/api/products");
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return res.json() as Promise<Product[]>;
  },
);

// Delete Product
export const deleteProductAsync = createAsyncThunk(
  "products/delete",
  async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete product");
    }

    return productId;
  },
);

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addProductAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        addProductAsync.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.products.unshift(action.payload);
        },
      )
      .addCase(addProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to add product";
      })

      // Update Product
      .addCase(updateProductAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProductAsync.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          const index = state.products.findIndex(
            (p) => p.id === action.payload.id,
          );
          if (index !== -1) state.products[index] = action.payload;
        },
      )
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update product";
      })

      // Fetch Products
      .addCase(fetchProductsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsAsync.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.products = action.payload;
        },
      )
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Delete Product
      .addCase(deleteProductAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteProductAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.products = state.products.filter(
            (p) => p.id !== action.payload,
          );
        },
      )
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
