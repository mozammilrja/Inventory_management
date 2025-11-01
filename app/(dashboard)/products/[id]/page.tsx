"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/store/hooks";
import { ProductForm } from "@/components/products/product-form";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  STATUS_COLORS,
  CONDITION_COLORS,
  DEPARTMENT_COLORS,
} from "@/lib/constants";

export default function AssetDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { products } = useAppSelector((state) => state.product);

  const productId = params?.id;
  const product = products.find((p) => p.id === productId);

  const viewMode = searchParams.get("view") === "true";
  const [isEditing, setIsEditing] = useState(!viewMode);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Missing Product
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-2xl w-full text-center p-8">
          <h1 className="text-2xl font-bold mb-2">Asset Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The asset you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assets
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Edit Mode
  if (isEditing) {
    return (
      <div className="min-h-screen flex flex-col px-6 lg:px-20 py-10 space-y-8 bg-muted/30">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Edit Asset</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Update asset information
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-5xl border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>
                Update the details below to modify the asset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={product}
                onSuccess={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="min-h-screen bg-muted/30 px-6 lg:px-20 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Complete asset details and information
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="w-full sm:w-auto flex items-center justify-center"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Asset
        </Button>
      </div>

      {/* Status Overview */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge
                variant="outline"
                className={
                  STATUS_COLORS[product.status as keyof typeof STATUS_COLORS] ||
                  ""
                }
              >
                {product.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Condition</p>
              <Badge
                variant="outline"
                className={
                  CONDITION_COLORS[
                    product.condition as keyof typeof CONDITION_COLORS
                  ] || ""
                }
              >
                {product.condition}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Asset Type</p>
              <Badge variant="outline">{product.assetType}</Badge>
            </div>
            <div className="truncate">
              <p className="text-sm text-muted-foreground mb-1">
                Serial Number
              </p>
              <p className="font-mono text-sm font-medium truncate">
                {product.serialNumber || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Asset Name", product.name],
              ["Brand", product.brand || "N/A"],
              ["Model", product.productModel || "N/A"],
              ["Asset Tag / SKU", product.sku || "N/A"],
              ["Description", product.description || "No description provided"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium break-words">{value}</p>
                <Separator className="my-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Employee Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.employeeName ? (
              <>
                {[
                  ["Employee Name", product.employeeName],
                  ["Employee ID", product.employeeId || "N/A"],
                  ["Employee Email", product.employeeEmail || "N/A"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium break-words">{value}</p>
                    <Separator className="my-2" />
                  </div>
                ))}
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  {product.department ? (
                    <Badge
                      variant="outline"
                      className={DEPARTMENT_COLORS[product.department] || ""}
                    >
                      {product.department}
                    </Badge>
                  ) : (
                    <p className="font-medium">N/A</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Not assigned to any employee
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates & Warranty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates & Warranty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Purchase Date", product.purchaseDate],
              ["Warranty Expiry", product.warrantyExpiry],
              ["Created At", product.createdAt],
              ["Last Updated", product.updatedAt],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{formatDate(value as string)}</p>
                <Separator className="my-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Location & Value */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Value
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium break-words">
                {product.location || "Not specified"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Asset Value</p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <p className="font-bold text-2xl truncate">
                  ${product.price?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes & Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.notes && (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {product.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {product.image && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Asset Image
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-start gap-4 flex-wrap">
              <img
                src={product.image}
                alt={product.name}
                className="w-[100px] h-[100px] rounded-md border border-slate-200 dark:border-slate-800 object-cover"
              />
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-muted-foreground">{product.name}</p>
                {product.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
