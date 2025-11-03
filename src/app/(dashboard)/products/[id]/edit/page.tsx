"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/products/product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
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

export default function ProductEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${params.id}`);

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
      setError(err.message || "Failed to load product");
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    toast.success("Asset updated successfully");
    router.push(`/products/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                disabled
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="flex-1">
                <div className="h-6 sm:h-8 w-32 sm:w-40 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-48 sm:w-60 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick Info Skeleton */}
          <div className="w-full mb-4 sm:mb-6 bg-card rounded-lg border border-border/50 p-4 animate-pulse">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <Card className="w-full border-0 shadow-lg sm:shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6 border-b">
              <div className="h-5 sm:h-6 w-40 sm:w-48 bg-muted rounded animate-pulse mx-auto mb-2" />
              <div className="h-3 sm:h-4 w-64 sm:w-96 bg-muted rounded animate-pulse mx-auto" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href={`/products/${params.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted/50 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Edit Asset
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base lg:text-lg">
                  Unable to load asset
                </p>
              </div>
            </div>
          </div>

          {/* Error Card */}
          <Card className="w-full border-0 shadow-lg sm:shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <div className="max-w-md mx-auto py-4 sm:py-6 lg:py-8">
                <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  Asset Not Found
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                  {error ||
                    "The asset you're trying to edit doesn't exist or has been deleted."}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  <Button
                    onClick={fetchProduct}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    Try Again
                  </Button>
                  <Link href="/products">
                    <Button size="sm" className="text-sm">
                      Back to Assets
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href={`/products/${params.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted/50 transition-colors h-8 w-8 sm:h-10 sm:w-10"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Edit IT Asset
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base lg:text-lg">
                Update the details for {product.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>Asset ID:</span>
            <code className="px-1 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-xs font-mono">
              {params.id}
            </code>
          </div>
        </div>

        {/* Quick Asset Info */}
        <Card className="w-full mb-4 sm:mb-6 border-l-4 border-l-primary">
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-muted-foreground">Current Status:</span>
                <div className="font-semibold mt-0.5 sm:mt-1 text-sm sm:text-base">
                  {product.status}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Condition:</span>
                <div className="font-semibold mt-0.5 sm:mt-1 text-sm sm:text-base">
                  {product.condition}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Assigned To:</span>
                <div className="font-semibold mt-0.5 sm:mt-1 text-sm sm:text-base">
                  {product.employeeName || "Unassigned"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Value:</span>
                <div className="font-semibold mt-0.5 sm:mt-1 text-sm sm:text-base">
                  ${product.price?.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="w-full border-0 shadow-lg sm:shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 sm:pb-6 border-b">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Edit Asset Information
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update the details below to modify this IT asset. All changes will
              be saved immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <ProductForm product={product} onSuccess={handleSuccess} />
          </CardContent>
        </Card>

        {/* Quick Actions Footer */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex flex-col xs:flex-row items-center gap-1 sm:gap-2 xs:gap-4">
            <span>Last updated: {formatDate(product.updatedAt)}</span>
            <span className="hidden xs:block">•</span>
            <span>Created: {formatDate(product.createdAt)}</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/products/${params.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                View Asset
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                All Assets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
