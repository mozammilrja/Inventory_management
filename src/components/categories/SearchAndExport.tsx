import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Download, ChevronDown, FileText } from "lucide-react";

interface SearchAndExportProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: (type: "csv" | "excel" | "pdf") => void;
  isLoading: boolean;
  totalCategories: number;
}

export const SearchAndExport = ({
  searchTerm,
  onSearchChange,
  onExport,
  isLoading,
  totalCategories,
}: SearchAndExportProps) => (
  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between w-full">
    {/* Search Bar */}
    <div className="relative flex-1 w-full max-w-full md:max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 w-full"
        disabled={isLoading}
      />
    </div>

    {/* Export Dropdown */}
    <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            title="Export categories"
            className="flex items-center gap-2 w-full md:w-auto"
            disabled={isLoading || totalCategories === 0}
          >
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Export Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            <span>CSV (Spreadsheet)</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport("excel")}>
            <Download className="mr-2 h-4 w-4" />
            <span>Excel (Report)</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>PDF (Print)</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {totalCategories} categories
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);
