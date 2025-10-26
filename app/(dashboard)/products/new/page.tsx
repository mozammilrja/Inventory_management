'use client';

import { ProductForm } from '@/components/products/product-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New IT Asset</h1>
          <p className="text-muted-foreground mt-1">Register a new hardware asset in the system</p>
        </div>
      </div>

      <Card className="max-w-4xl border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Asset Information</CardTitle>
          <CardDescription>Fill in the details below to add a new IT asset</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
