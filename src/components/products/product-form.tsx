"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Package,
  User,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEPARTMENTS,
  ASSET_TYPES,
  ASSET_STATUS,
  ASSET_CONDITION,
  BRANDS,
  STATUS_COLORS,
  CONDITION_COLORS,
} from "@/lib/constants";

const productSchema = z.object({
  // Asset Information
  name: z.string().min(3, "Asset name must be at least 3 characters"),
  assetType: z.string().min(1, "Asset type is required"),
  serialNumber: z
    .string()
    .min(3, "Serial number must be at least 3 characters"),
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

interface Product {
  id: string;
  name: string;
  assetType: string;
  serialNumber: string;
  brand: string;
  productModel: string;
  sku: string;
  status: string;
  condition: string;
  employeeName: string;
  employeeId: string;
  employeeEmail: string;
  department: string;
  assignmentDate: string;
  returnDate: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  price: number;
  description: string;
  image: string;
  notes: string;
  category: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      assetType: product?.assetType || "",
      serialNumber: product?.serialNumber || `SN-${Date.now()}`,
      brand: product?.brand || "",
      productModel: product?.productModel || "",
      sku: product?.sku || `AST-${Date.now()}`,
      status: (product?.status as any) || "Available",
      condition: (product?.condition as any) || "Good",
      employeeName: product?.employeeName || "",
      employeeId: product?.employeeId || "",
      employeeEmail: product?.employeeEmail || "",
      department: product?.department || "",
      assignmentDate: product?.assignmentDate || "",
      purchaseDate:
        product?.purchaseDate || new Date().toISOString().split("T")[0],
      warrantyExpiry: product?.warrantyExpiry || "",
      location: product?.location || "",
      price: product?.price || 0,
      description: product?.description || "",
      image: product?.image || "",
      notes: product?.notes || "",
    },
  });

  // Watch only specific fields that need real-time updates
  const statusValue = watch("status");
  const conditionValue = watch("condition");
  const assetTypeValue = watch("assetType");
  const brandValue = watch("brand");
  const departmentValue = watch("department");
  const imageValue = watch("image");

  // Handle image preview
  useEffect(() => {
    if (imageValue) {
      setImagePreview(imageValue);
    }
  }, [imageValue]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        model: data.productModel,
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
        category: data.assetType,
        quantity: data.status === "Available" ? 1 : 0,
      };

      console.log("Submitting data:", formData);

      if (product) {
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update product");
        }

        const result = await response.json();
        console.log("Product updated:", result);
        toast.success("Asset updated successfully");
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create product");
        }

        const result = await response.json();
        console.log("Product created:", result);
        toast.success("Asset added successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast.error(
        err.message ||
          (product ? "Failed to update asset" : "Failed to add asset")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current values for review tab only
  const getCurrentValues = () => {
    return getValues();
  };

  // Tab navigation handlers with proper validation
  const handleNextFromBasic = async () => {
    const isValid = await trigger([
      "name",
      "assetType",
      "brand",
      "productModel",
      "serialNumber",
      "sku",
    ]);
    if (isValid) {
      setActiveTab("details");
    } else {
      toast.error("Please fill all required fields in Basic Information");
    }
  };

  const handleNextFromDetails = async () => {
    const isValid = await trigger([
      "status",
      "condition",
      "price",
      "description",
    ]);
    if (isValid) {
      setActiveTab("assignment");
    } else {
      toast.error("Please fill all required fields in Details");
    }
  };

  const handleNextFromAssignment = async () => {
    setActiveTab("review");
  };

  const FormField = ({
    children,
    label,
    error,
    required = false,
    icon: Icon,
  }: {
    children: React.ReactNode;
    label: string;
    error?: string;
    required?: boolean;
    icon?: React.ComponentType<any>;
  }) => (
    <div className="space-y-2">
      <Label
        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
        className="flex items-center gap-2 text-sm md:text-base"
      >
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );

  // Responsive grid classes
  const gridCols = "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6";
  const responsivePadding = "px-4 sm:px-6 lg:px-8";
  const responsiveText = "text-sm sm:text-base";

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header with Progress */}
      <div
        className={`text-center space-y-4 mb-6 md:mb-8 ${responsivePadding}`}
      >
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {product ? "Edit Asset" : "Add New Asset"}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {product
              ? "Update your asset information below"
              : "Fill in the details to add a new asset to your inventory"}
          </p>
        </div>

        {/* Progress Steps - Responsive */}
        <div className="flex justify-center items-center space-x-2 sm:space-x-4">
          {["basic", "details", "assignment", "review"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 text-xs sm:text-sm ${
                  activeTab === step
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < 3 && (
                <div className="w-4 sm:w-8 md:w-12 h-0.5 bg-muted-foreground/30 mx-1 sm:mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Responsive Tabs List - Fixed to show tab names */}
        <TabsList
          className={`grid w-full grid-cols-4 mb-4 md:mb-8 h-auto ${responsivePadding}`}
        >
          <TabsTrigger
            value="basic"
            className="flex flex-col items-center gap-1 p-2 md:p-4 text-xs md:text-sm"
          >
            <Package className="h-3 w-3 md:h-4 md:w-4" />
            <span>Basic</span>
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex flex-col items-center gap-1 p-2 md:p-4 text-xs md:text-sm"
          >
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="assignment"
            className="flex flex-col items-center gap-1 p-2 md:p-4 text-xs md:text-sm"
          >
            <User className="h-3 w-3 md:h-4 md:w-4" />
            <span>Assign</span>
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="flex flex-col items-center gap-1 p-2 md:p-4 text-xs md:text-sm"
          >
            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
            <span>Review</span>
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 md:space-y-6 w-full">
            <Card className="mx-2 sm:mx-4 md:mx-0">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Asset Information
                </CardTitle>
                <CardDescription className={responsiveText}>
                  Enter the basic details about your asset
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className={gridCols}>
                  <FormField
                    label="Asset Name"
                    error={errors.name?.message}
                    required
                    icon={Package}
                  >
                    <Input
                      {...register("name")}
                      placeholder="e.g., Dell Latitude 5520"
                      className="h-10 md:h-11"
                    />
                  </FormField>

                  <FormField
                    label="Asset Type"
                    error={errors.assetType?.message}
                    required
                    icon={Package}
                  >
                    <Select
                      value={assetTypeValue}
                      onValueChange={(value) => setValue("assetType", value)}
                    >
                      <SelectTrigger className="h-10 md:h-11">
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
                  </FormField>
                </div>

                <div className={gridCols}>
                  <FormField
                    label="Brand"
                    error={errors.brand?.message}
                    required
                    icon={Package}
                  >
                    <Select
                      value={brandValue}
                      onValueChange={(value) => setValue("brand", value)}
                    >
                      <SelectTrigger className="h-10 md:h-11">
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
                  </FormField>

                  <FormField
                    label="Model"
                    error={errors.productModel?.message}
                    required
                    icon={Package}
                  >
                    <Input
                      {...register("productModel")}
                      placeholder="e.g., Latitude 5520"
                      className="h-10 md:h-11"
                    />
                  </FormField>
                </div>

                <Separator />

                <div className={gridCols}>
                  <FormField
                    label="Serial Number"
                    error={errors.serialNumber?.message}
                    required
                    icon={FileText}
                  >
                    <Input
                      {...register("serialNumber")}
                      placeholder="e.g., SN-123456"
                      className="h-10 md:h-11 font-mono text-sm"
                    />
                  </FormField>

                  <FormField
                    label="Asset Tag / SKU"
                    error={errors.sku?.message}
                    required
                    icon={FileText}
                  >
                    <Input
                      {...register("sku")}
                      placeholder="e.g., AST-001"
                      className="h-10 md:h-11 font-mono text-sm"
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            <div
              className={`flex flex-col sm:flex-row justify-between gap-3 ${responsivePadding}`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}
                className="order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleNextFromBasic}
                className="order-1 sm:order-2"
              >
                Next: Details
              </Button>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent
            value="details"
            className="space-y-4 md:space-y-6 w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="mx-2 sm:mx-4 md:mx-0">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    Status & Condition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <FormField
                    label="Status"
                    error={errors.status?.message}
                    required
                    icon={FileText}
                  >
                    <Select
                      value={statusValue}
                      onValueChange={(value: any) => setValue("status", value)}
                    >
                      <SelectTrigger className="h-10 md:h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${STATUS_COLORS[
                                  status as keyof typeof STATUS_COLORS
                                ]?.replace("text-", "bg-")}`}
                              />
                              {status}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Condition"
                    error={errors.condition?.message}
                    required
                    icon={FileText}
                  >
                    <Select
                      value={conditionValue}
                      onValueChange={(value: any) =>
                        setValue("condition", value)
                      }
                    >
                      <SelectTrigger className="h-10 md:h-11">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_CONDITION.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${CONDITION_COLORS[
                                  condition as keyof typeof CONDITION_COLORS
                                ]?.replace("text-", "bg-")}`}
                              />
                              {condition}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </CardContent>
              </Card>

              <Card className="mx-2 sm:mx-4 md:mx-0">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    Value & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <FormField
                    label="Price / Value ($)"
                    error={errors.price?.message}
                    required
                    icon={DollarSign}
                  >
                    <Input
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="0.00"
                      className="h-10 md:h-11"
                    />
                  </FormField>

                  <FormField
                    label="Location"
                    error={errors.location?.message}
                    icon={MapPin}
                  >
                    <Input
                      {...register("location")}
                      placeholder="e.g., Head Office - Floor 3"
                      className="h-10 md:h-11"
                    />
                  </FormField>
                </CardContent>
              </Card>
            </div>

            <Card className="mx-2 sm:mx-4 md:mx-0">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Dates & Warranty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={gridCols}>
                  <FormField label="Purchase Date" icon={Calendar}>
                    <Input
                      type="date"
                      {...register("purchaseDate")}
                      className="h-10 md:h-11"
                    />
                  </FormField>

                  <FormField label="Warranty Expiry" icon={Calendar}>
                    <Input
                      type="date"
                      {...register("warrantyExpiry")}
                      className="h-10 md:h-11"
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            <Card className="mx-2 sm:mx-4 md:mx-0">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  label="Description"
                  error={errors.description?.message}
                  required
                  icon={FileText}
                >
                  <Textarea
                    {...register("description")}
                    placeholder="Enter asset description, specifications, etc. (Minimum 10 characters)"
                    rows={4}
                    className="resize-none text-sm md:text-base"
                  />
                </FormField>
              </CardContent>
            </Card>

            <div
              className={`flex flex-col sm:flex-row justify-between gap-3 ${responsivePadding}`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("basic")}
                className="order-2 sm:order-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNextFromDetails}
                className="order-1 sm:order-2"
              >
                Next: Assignment
              </Button>
            </div>
          </TabsContent>

          {/* Assignment Tab */}
          <TabsContent
            value="assignment"
            className="space-y-4 md:space-y-6 w-full"
          >
            <Card className="mx-2 sm:mx-4 md:mx-0">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Employee Assignment
                </CardTitle>
                <CardDescription className={responsiveText}>
                  Optional: Assign this asset to an employee
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className={gridCols}>
                  <FormField label="Employee Name" icon={User}>
                    <Input
                      {...register("employeeName")}
                      placeholder="e.g., John Smith"
                      className="h-10 md:h-11"
                    />
                  </FormField>

                  <FormField label="Employee ID" icon={User}>
                    <Input
                      {...register("employeeId")}
                      placeholder="e.g., EMP-1234"
                      className="h-10 md:h-11"
                    />
                  </FormField>
                </div>

                <div className={gridCols}>
                  <FormField
                    label="Employee Email"
                    error={errors.employeeEmail?.message}
                    icon={User}
                  >
                    <Input
                      type="email"
                      {...register("employeeEmail")}
                      placeholder="e.g., john@company.com"
                      className="h-10 md:h-11"
                    />
                  </FormField>

                  <FormField label="Department" icon={User}>
                    <Select
                      value={departmentValue}
                      onValueChange={(value) => setValue("department", value)}
                    >
                      <SelectTrigger className="h-10 md:h-11">
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
                  </FormField>
                </div>

                <FormField label="Assignment Date" icon={Calendar}>
                  <Input
                    type="date"
                    {...register("assignmentDate")}
                    className="h-10 md:h-11"
                  />
                </FormField>
              </CardContent>
            </Card>

            <Card className="mx-2 sm:mx-4 md:mx-0">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <FormField label="Notes" icon={FileText}>
                  <Textarea
                    {...register("notes")}
                    placeholder="Any additional notes or comments"
                    rows={3}
                    className="resize-none text-sm md:text-base"
                  />
                </FormField>

                <FormField
                  label="Image URL"
                  error={errors.image?.message}
                  icon={ImageIcon}
                >
                  <Input
                    {...register("image")}
                    placeholder="https://example.com/image.jpg"
                    className="h-10 md:h-11"
                  />
                </FormField>

                {imagePreview && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="mt-2 border rounded-lg p-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-24 md:h-32 object-contain mx-auto"
                        onError={() => setImagePreview(null)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div
              className={`flex flex-col sm:flex-row justify-between gap-3 ${responsivePadding}`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("details")}
                className="order-2 sm:order-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNextFromAssignment}
                className="order-1 sm:order-2"
              >
                Next: Review
              </Button>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-4 md:space-y-6 w-full">
            <ReviewTab
              getCurrentValues={getCurrentValues}
              isMobile={isMobile}
            />

            <div
              className={`flex flex-col sm:flex-row justify-between gap-3 ${responsivePadding}`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("assignment")}
                className="order-2 sm:order-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32 order-1 sm:order-2"
                size={isMobile ? "default" : "lg"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {product ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{product ? "Update Asset" : "Create Asset"}</>
                )}
              </Button>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}

// Separate component for Review tab to prevent unnecessary re-renders
function ReviewTab({
  getCurrentValues,
  isMobile,
}: {
  getCurrentValues: () => any;
  isMobile: boolean;
}) {
  const values = getCurrentValues();

  return (
    <Card className="mx-2 sm:mx-4 md:mx-0">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Review Asset Information
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Please review all the information before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Basic Info Review */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
              <Package className="h-3 w-3 md:h-4 md:w-4" />
              Basic Information
            </h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-right">{values.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-right">
                  {values.assetType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium text-right">{values.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium text-right">
                  {values.productModel}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              Identification
            </h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serial No:</span>
                <span className="font-medium font-mono text-right">
                  {values.serialNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium font-mono text-right">
                  {values.sku}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    STATUS_COLORS[
                      values.status as keyof typeof STATUS_COLORS
                    ] || ""
                  }`}
                >
                  {values.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Condition:</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    CONDITION_COLORS[
                      values.condition as keyof typeof CONDITION_COLORS
                    ] || ""
                  }`}
                >
                  {values.condition}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Financial & Assignment Review */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
              <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
              Financial Details
            </h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value:</span>
                <span className="font-medium text-right">
                  ${values.price?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium text-right">
                  {values.location || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
              <User className="h-3 w-3 md:h-4 md:w-4" />
              Assignment
            </h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee:</span>
                <span className="font-medium text-right">
                  {values.employeeName || "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium text-right">
                  {values.department || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Description Review */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            Description
          </h4>
          <p className="text-xs md:text-sm text-muted-foreground">
            {values.description || "No description provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
