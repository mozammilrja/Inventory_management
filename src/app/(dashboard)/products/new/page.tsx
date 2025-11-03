"use client";

import { ProductForm } from "@/components/products/product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function NewProductPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-4 md:py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
        {/* Header - Responsive */}
        {!isMobile && (
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <Link href="/products">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Add New IT Asset
              </h1>
              <p className="text-muted-foreground mt-1 md:mt-2 text-sm sm:text-base md:text-lg">
                Register a new hardware asset in the system
              </p>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center gap-3 mb-6">
            <Link href="/products">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted/50 transition-colors h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Add New Asset
              </h1>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Register new hardware asset
              </p>
            </div>
          </div>
        )}

        {/* Main Content - Responsive Card */}
        <Card className="w-full border-0 shadow-lg md:shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 md:pb-6 border-b">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Asset Registration
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base">
              Complete all sections to add your new IT asset to the inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 md:p-6 lg:p-8">
            <ProductForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
