// types/product.ts
export interface Product {
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

export interface ProductFormData
  extends Omit<Product, "id" | "createdAt" | "updatedAt"> {}

export interface ProductsResponse {
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
