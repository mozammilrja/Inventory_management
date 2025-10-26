'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { ProductForm } from '@/components/products/product-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar, DollarSign, MapPin, Package, User, Wrench, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { STATUS_COLORS, CONDITION_COLORS, DEPARTMENT_COLORS } from '@/lib/constants';

export default function AssetDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id as string;
  const { products } = useAppSelector((state) => state.product);
  const product = products.find((p) => p.id === productId);

  // Check if view mode is requested via query parameter
  const viewMode = searchParams.get('view') === 'true';
  const [isEditing, setIsEditing] = useState(!viewMode);

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Not Found</h1>
            <p className="text-muted-foreground mt-1">The asset you&apos;re looking for doesn&apos;t exist</p>
          </div>
        </div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Asset</h1>
            <p className="text-muted-foreground mt-1">Update asset information</p>
          </div>
        </div>

        <Card className="max-w-2xl border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
            <CardDescription>Update the details below to modify the asset</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm product={product} onSuccess={() => setIsEditing(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground mt-1">Complete asset details and information</p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Asset
        </Button>
      </div>

      {/* Status Overview Card */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <Badge variant="outline" className={STATUS_COLORS[product.status as keyof typeof STATUS_COLORS]}>
                {product.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Condition</p>
              <Badge variant="outline" className={CONDITION_COLORS[product.condition as keyof typeof CONDITION_COLORS]}>
                {product.condition}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Asset Type</p>
              <Badge variant="outline">{product.assetType}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Serial Number</p>
              <p className="font-mono text-sm font-medium">{product.serialNumber || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Information */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Asset Name</p>
              <p className="font-medium">{product.name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Brand</p>
              <p className="font-medium">{product.brand || 'N/A'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-medium">{product.model || 'N/A'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Asset Tag / SKU</p>
              <p className="font-medium font-mono">{product.sku || 'N/A'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{product.description || 'No description provided'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Employee Assignment */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.employeeName ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Employee Name</p>
                  <p className="font-medium">{product.employeeName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium font-mono">{product.employeeId || 'N/A'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Employee Email</p>
                  <p className="font-medium">{product.employeeEmail || 'N/A'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  {product.department ? (
                    <Badge variant="outline" className={DEPARTMENT_COLORS[product.department] || ''}>
                      {product.department}
                    </Badge>
                  ) : (
                    <p className="font-medium">N/A</p>
                  )}
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Assignment Date</p>
                  <p className="font-medium">{formatDate(product.assignmentDate)}</p>
                </div>
                {product.returnDate && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Return Date</p>
                      <p className="font-medium">{formatDate(product.returnDate)}</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Not assigned to any employee</p>
                <p className="text-sm text-muted-foreground mt-1">This asset is currently unassigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates & Warranty */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates & Warranty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Purchase Date</p>
              <p className="font-medium">{formatDate(product.purchaseDate)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Warranty Expiry</p>
              <p className="font-medium">{formatDate(product.warrantyExpiry)}</p>
              {product.warrantyExpiry && new Date(product.warrantyExpiry) < new Date() && (
                <Badge variant="outline" className="mt-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Warranty Expired
                </Badge>
              )}
              {product.warrantyExpiry && new Date(product.warrantyExpiry) >= new Date() && (
                <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Under Warranty
                </Badge>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(product.createdAt)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(product.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Value */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Value
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{product.location || 'Not specified'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Asset Value</p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <p className="font-bold text-2xl">${product.price?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {product.notes && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{product.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Image */}
      {product.image && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Asset Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={product.image}
              alt={product.name}
              className="max-w-md rounded-lg border border-slate-200 dark:border-slate-800"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
