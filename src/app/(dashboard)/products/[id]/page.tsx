"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  MapPin,
  Package,
  User,
  FileText,
  Cpu,
  Building,
  Mail,
  IdCard,
  Shield,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Wrench,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  STATUS_COLORS,
  CONDITION_COLORS,
  DEPARTMENT_COLORS,
} from "@/lib/constants";
import { toast } from "sonner";

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

// Responsive Skeleton Loader Component
function FullWidthSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header Skeleton */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 sm:h-8 w-48 sm:w-80" />
                <Skeleton className="h-4 w-32 sm:w-60" />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-8 w-20 sm:w-24 rounded-md" />
              <Skeleton className="h-9 w-28 sm:w-32 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="bg-muted/20 border-b border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    <Skeleton className="h-4 sm:h-6 w-12 sm:w-16" />
                  </div>
                  <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Asset Information */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-4" />
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                      <Skeleton className="h-4 sm:h-5 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-px w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-28" />
                  <Skeleton className="h-12 sm:h-16 w-full" />
                </div>
              </div>
            </div>

            {/* Employee Assignment */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 mb-4" />
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-24 sm:w-28" />
                      <Skeleton className="h-4 sm:h-5 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-px w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-28 sm:w-32" />
                      <Skeleton className="h-4 sm:h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Dates & Warranty */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-4" />
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-24 sm:w-28" />
                    <Skeleton className="h-4 sm:h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mb-4" />
              <div className="space-y-2 sm:space-y-3">
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-3/4" />
                <Skeleton className="h-3 sm:h-4 w-1/2" />
              </div>
            </div>

            {/* Image */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <Skeleton className="h-5 sm:h-6 w-20 sm:w-28 mb-4" />
              <Skeleton className="h-32 sm:h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex flex-col xs:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            <div className="hidden xs:block">
              <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 rounded-full" />
            </div>
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 sm:h-8 w-16 sm:w-20 rounded-md" />
            <Skeleton className="h-7 sm:h-8 w-20 sm:w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssetDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data from API
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error("Failed to fetch product");
      }

      const productData = await response.json();
      setProduct(productData);
    } catch (err: any) {
      console.error("Error fetching product:", err);
      setError(err.message || "Something went wrong");
      toast.error("Failed to load asset details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "Assigned":
        return <User className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "Under Repair":
        return <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "Retired":
        return <Archive className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Package className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  // Loading state
  if (loading) {
    return <FullWidthSkeleton />;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-xl sm:rounded-2xl border border-border/50 p-6 sm:p-8 shadow-lg text-center">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive mx-auto mb-3 sm:mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
              Asset Unavailable
            </h3>
            <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-8">
              {error ||
                "The asset you're looking for doesn't exist or has been removed from the system."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                onClick={fetchProduct}
                variant="outline"
                className="gap-2 text-sm sm:text-base"
                size="sm"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                Try Again
              </Button>
              <Link href="/products">
                <Button className="gap-2 text-sm sm:text-base" size="sm">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  Back to Assets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/products">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted/50 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {product.name}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1">
                  {product.assetType} • {product.brand} {product.productModel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                <IdCard className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>ID:</span>
                <code className="font-mono text-xs">{product.id}</code>
              </div>
              <Link href={`/products/${productId}/edit`}>
                <Button className="gap-1 sm:gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  Edit Asset
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-muted/20 border-b border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Status Card */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-3 sm:p-4 lg:p-6 shadow-sm border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs sm:text-sm font-semibold ${
                      STATUS_COLORS[
                        product.status as keyof typeof STATUS_COLORS
                      ] || ""
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(product.status)}
                      {product.status}
                    </span>
                  </Badge>
                </div>
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-500 opacity-60" />
              </div>
            </div>

            {/* Condition Card */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-3 sm:p-4 lg:p-6 shadow-sm border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Condition
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs sm:text-sm font-semibold ${
                      CONDITION_COLORS[
                        product.condition as keyof typeof CONDITION_COLORS
                      ] || ""
                    }`}
                  >
                    {product.condition}
                  </Badge>
                </div>
                <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-500 opacity-60" />
              </div>
            </div>

            {/* Asset Value Card */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-3 sm:p-4 lg:p-6 shadow-sm border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Asset Value
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                      ${product.price?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-500 opacity-60" />
              </div>
            </div>

            {/* Serial Number Card */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-3 sm:p-4 lg:p-6 shadow-sm border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Serial Number
                  </p>
                  <code className="font-mono text-xs sm:text-sm font-bold text-foreground bg-muted px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                    {product.serialNumber || "N/A"}
                  </code>
                </div>
                <Cpu className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-500 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Asset Details */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Asset Information */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/50">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Asset Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <DetailItem label="Asset Name" value={product.name} />
                <DetailItem label="Asset Type" value={product.assetType} />
                <DetailItem label="Brand" value={product.brand} />
                <DetailItem label="Model" value={product.productModel} />
                <DetailItem
                  label="SKU / Asset Tag"
                  value={product.sku}
                  isCode
                />
                <DetailItem
                  label="Location"
                  value={product.location || "Not specified"}
                />
              </div>

              <Separator className="my-4 sm:my-6" />

              <div>
                <LabelWithIcon icon={FileText} label="Description" />
                <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
                  {product.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Employee Assignment */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/50">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Employee Assignment
              </div>
              {product.employeeName ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <DetailItem
                      label="Employee Name"
                      value={product.employeeName}
                      icon={User}
                    />
                    <DetailItem
                      label="Employee ID"
                      value={product.employeeId}
                      icon={IdCard}
                      isCode
                    />
                    <DetailItem
                      label="Email"
                      value={product.employeeEmail}
                      icon={Mail}
                    />
                    <DetailItem
                      label="Department"
                      value={product.department}
                      icon={Building}
                      badge={
                        product.department ? (
                          <Badge
                            variant="outline"
                            className={
                              DEPARTMENT_COLORS[product.department] || ""
                            }
                          >
                            {product.department}
                          </Badge>
                        ) : undefined
                      }
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <DetailItem
                      label="Assignment Date"
                      value={formatDate(product.assignmentDate)}
                      icon={Calendar}
                    />
                    {product.returnDate && (
                      <DetailItem
                        label="Expected Return"
                        value={formatDate(product.returnDate)}
                        icon={Calendar}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <User className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-3 sm:mb-4 opacity-50" />
                  <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-1 sm:mb-2">
                    Not Assigned
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    This asset is currently not assigned to any employee
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Dates & Warranty */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/50">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Dates & Warranty
              </div>
              <div className="space-y-3 sm:space-y-4">
                <DetailItem
                  label="Purchase Date"
                  value={formatDate(product.purchaseDate)}
                />
                <DetailItem
                  label="Warranty Expiry"
                  value={formatDate(product.warrantyExpiry)}
                />
                <Separator />
                <DetailItem
                  label="Created"
                  value={formatDate(product.createdAt)}
                  icon={Clock}
                />
                <DetailItem
                  label="Last Updated"
                  value={formatDate(product.updatedAt)}
                  icon={RefreshCw}
                />
              </div>
            </div>

            {/* Notes & Image */}
            {product.notes && (
              <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/50">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Additional Notes
                </div>
                <p className="text-muted-foreground text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                  {product.notes}
                </p>
              </div>
            )}

            {product.image && (
              <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/50">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Asset Image
                </div>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full max-w-xs h-32 sm:h-48 object-cover rounded-lg border shadow-sm"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                    {product.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex flex-col xs:flex-row items-center gap-1 sm:gap-2 xs:gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {formatDate(product.updatedAt)}
            </span>
            <span className="hidden xs:block">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created: {formatDate(product.createdAt)}
            </span>
          </div>
          <div className="flex gap-2">
            <Link href="/products">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                All Assets
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProduct}
              className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Item Component
function DetailItem({
  label,
  value,
  icon: Icon,
  isCode = false,
  badge,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<any>;
  isCode?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div className="space-y-1 sm:space-y-2">
      <LabelWithIcon icon={Icon} label={label} />
      <div className="flex items-center gap-1 sm:gap-2">
        {isCode ? (
          <code className="font-mono text-xs sm:text-sm bg-muted px-1 sm:px-2 py-0.5 sm:py-1 rounded flex-1">
            {value || "N/A"}
          </code>
        ) : (
          <span className="font-medium text-foreground text-sm sm:text-base">
            {value || "Not specified"}
          </span>
        )}
        {badge}
      </div>
    </div>
  );
}

// Reusable Label with Icon Component
function LabelWithIcon({
  icon: Icon,
  label,
}: {
  icon?: React.ComponentType<any>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
