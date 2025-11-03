"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackageX, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-center p-4">
      <Card className="p-8 shadow-xl max-w-md w-full">
        <CardContent className="flex flex-col items-center space-y-6 pt-6">
          <div className="flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full">
            <PackageX className="w-12 h-12 text-slate-600 dark:text-slate-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-50">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
              Page Not Found
            </h2>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Oops! The page you're looking for doesn’t exist or has been moved.
            Please check the URL or return to the homepage.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} AssetPro — All rights reserved.
      </p>
    </div>
  );
}
