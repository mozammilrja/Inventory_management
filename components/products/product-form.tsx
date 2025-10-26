"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  addProductAsync,
  updateProductAsync,
  Product,
} from "@/lib/store/slices/productSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import {
  DEPARTMENTS,
  ASSET_TYPES,
  ASSET_STATUS,
  ASSET_CONDITION,
  BRANDS,
} from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const productSchema = z.object({
  // Asset Information
  name: z.string().min(3, "Asset name must be at least 3 characters"),
  assetType: z.string().min(1, "Asset type is required"),
  serialNumber: z.string().min(3, "Serial number must be at least 3 characters"),
  brand: z.string().min(1, "Brand is required"),
  productModel: z.string().min(1, "Model is required"),
  sku: z.string().min(3, "SKU/Asset tag must be at least 3 characters"),

  // Status & Condition
  status: z.enum(["Available", "Assigned", "Under Repair", "Retired"]),
  condition: z.enum(["New", "Good", "Fair", "Poor"]),

  // Employee Assignment (optional)
  employeeName: z.string().optional(),
  employeeId: z.string().optional(),
  employeeEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  department: z.string().optional(),
  assignmentDate: z.string().optional(),

  // Dates & Warranty
  purchaseDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),

  // Location & Value
  location: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),

  // Additional Info
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          assetType: product.assetType,
          serialNumber: product.serialNumber,
          brand: product.brand,
          productModel: product.productModel,
          sku: product.sku,
          status: product.status,
          condition: product.condition,
          employeeName: product.employeeName || "",
          employeeId: product.employeeId || "",
          employeeEmail: product.employeeEmail || "",
          department: product.department || "",
          assignmentDate: product.assignmentDate || "",
          purchaseDate: product.purchaseDate || "",
          warrantyExpiry: product.warrantyExpiry || "",
          location: product.location || "",
          price: product.price,
          description: product.description,
          image: product.image || "",
          notes: product.notes || "",
        }
      : {
          name: "",
          assetType: "",
          serialNumber: `SN-${Date.now()}`,
          brand: "",
          productModel: "",
          sku: `AST-${Date.now()}`,
          status: "Available" as const,
          condition: "Good" as const,
          employeeName: "",
          employeeId: "",
          employeeEmail: "",
          department: "",
          assignmentDate: "",
          purchaseDate: "",
          warrantyExpiry: "",
          location: "",
          price: 0,
          description: "",
          image: "",
          notes: "",
        },
  });

  const assetTypeValue = watch("assetType");
  const statusValue = watch("status");
  const brandValue = watch("brand");
  const departmentValue = watch("department");
  const conditionValue = watch("condition");

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = {
        ...data,
        image: data.image || undefined,
        employeeName: data.employeeName || undefined,
        employeeId: data.employeeId || undefined,
        employeeEmail: data.employeeEmail || undefined,
        department: data.department || undefined,
        assignmentDate: data.assignmentDate || undefined,
        purchaseDate: data.purchaseDate || undefined,
        warrantyExpiry: data.warrantyExpiry || undefined,
        location: data.location || undefined,
        notes: data.notes || undefined,
        category: data.assetType, // Map assetType to category
        quantity: data.status === "Available" ? 1 : 0,
      };

      if (product) {
        await dispatch(
          updateProductAsync({
            ...product,
            ...formData,
          }),
        ).unwrap();
        toast.success("Asset updated successfully");
      } else {
        await dispatch(addProductAsync(formData)).unwrap();
        toast.success("Asset added successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/products");
      }
    } catch (err) {
      toast.error(
        product ? "Failed to update asset" : "Failed to add asset"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Asset Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Asset Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Dell Latitude 5520"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType">Asset Type *</Label>
            <Select
              value={assetTypeValue}
              onValueChange={(value) => setValue("assetType", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="assetType">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assetType && (
              <p className="text-sm text-red-600">{errors.assetType.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Select
              value={brandValue}
              onValueChange={(value) => setValue("brand", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="brand">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brand && (
              <p className="text-sm text-red-600">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productModel">Model *</Label>
            <Input
              id="productModel"
              {...register("productModel")}
              placeholder="e.g., Latitude 5520"
              disabled={isSubmitting}
            />
            {errors.productModel && (
              <p className="text-sm text-red-600">{errors.productModel.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number *</Label>
            <Input
              id="serialNumber"
              {...register("serialNumber")}
              placeholder="e.g., SN-123456"
              disabled={isSubmitting}
              className="font-mono"
            />
            {errors.serialNumber && (
              <p className="text-sm text-red-600">{errors.serialNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">Asset Tag / SKU *</Label>
            <Input
              id="sku"
              {...register("sku")}
              placeholder="e.g., AST-001"
              disabled={isSubmitting}
              className="font-mono"
            />
            {errors.sku && (
              <p className="text-sm text-red-600">{errors.sku.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Status & Condition */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Status & Condition</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={statusValue}
              onValueChange={(value) => setValue("status", value as any)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition *</Label>
            <Select
              value={conditionValue}
              onValueChange={(value) => setValue("condition", value as any)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_CONDITION.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-sm text-red-600">{errors.condition.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Employee Assignment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Employee Assignment (Optional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name</Label>
            <Input
              id="employeeName"
              {...register("employeeName")}
              placeholder="e.g., John Smith"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              {...register("employeeId")}
              placeholder="e.g., EMP-1234"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeEmail">Employee Email</Label>
            <Input
              id="employeeEmail"
              type="email"
              {...register("employeeEmail")}
              placeholder="e.g., john@company.com"
              disabled={isSubmitting}
            />
            {errors.employeeEmail && (
              <p className="text-sm text-red-600">{errors.employeeEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={departmentValue}
              onValueChange={(value) => setValue("department", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignmentDate">Assignment Date</Label>
          <Input
            id="assignmentDate"
            type="date"
            {...register("assignmentDate")}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Dates & Warranty */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Dates & Warranty</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...register("purchaseDate")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
            <Input
              id="warrantyExpiry"
              type="date"
              {...register("warrantyExpiry")}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Location & Value */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Location & Value</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., Head Office - Floor 3"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price / Value ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="0.00"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter asset description, specifications, etc."
            rows={4}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Any additional notes or comments"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL (Optional)</Label>
          <Input
            id="image"
            {...register("image")}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
          {errors.image && (
            <p className="text-sm text-red-600">{errors.image.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter a valid URL for the asset image
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>{product ? "Update Asset" : "Add Asset"}</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
