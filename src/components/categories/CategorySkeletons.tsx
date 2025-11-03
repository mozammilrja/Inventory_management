import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const CategoryCardSkeleton = () => (
  <Card className="border-slate-200 dark:border-slate-800">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Tag className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-5 w-12" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>Products</span>
        </div>
        <Skeleton className="h-5 w-8" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Total Stock</span>
        </div>
        <Skeleton className="h-5 w-12" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
        <span className="text-sm text-muted-foreground">Total Value</span>
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
  </Card>
);

export const CardsGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(count)].map((_, i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
);
