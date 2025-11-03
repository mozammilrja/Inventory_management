import { CategoryData } from "@/services/categories/categoriesService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Package, TrendingUp } from "lucide-react";

interface CategoryCardProps {
  category: CategoryData;
}

export const CategoryCard = ({ category }: CategoryCardProps) => (
  <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Tag className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </div>
          <CardTitle className="text-lg truncate" title={category.category}>
            {category.category}
          </CardTitle>
        </div>
        {category.lowStock > 0 && (
          <Badge variant="destructive" className="text-xs">
            {category.lowStock} Low
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>Products</span>
        </div>
        <span className="font-semibold">{category.count}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Total Stock</span>
        </div>
        <span className="font-semibold">
          {category.totalStock.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
        <span className="text-sm text-muted-foreground">Total Value</span>
        <span className="font-bold text-lg">
          $
          {category.totalValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </CardContent>
  </Card>
);
