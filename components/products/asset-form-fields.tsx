import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEPARTMENTS,
  ASSET_TYPES,
  ASSET_STATUS,
  ASSET_CONDITION,
  BRANDS,
} from "@/lib/constants";

export function AssetFormFields({ register, errors, setValue, watch, isSubmitting }: any) {
  const assetTypeValue = watch("assetType");
  const statusValue = watch("status");
  const brandValue = watch("brand");
  const departmentValue = watch("department");
  const conditionValue = watch("condition");

  return (
    <>
      {/* Asset Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Asset Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Dell Latitude 5520"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType">Asset Type *</Label>
            <Select
              value={assetTypeValue}
              onValueChange={(value) => setValue("assetType", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="assetType">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assetType && (
              <p className="text-sm text-red-600">{errors.assetType.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Select
              value={brandValue}
              onValueChange={(value) => setValue("brand", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="brand">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brand && (
              <p className="text-sm text-red-600">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              {...register("model")}
              placeholder="e.g., Latitude 5520"
              disabled={isSubmitting}
            />
            {errors.model && (
              <p className="text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number *</Label>
            <Input
              id="serialNumber"
              {...register("serialNumber")}
              placeholder="e.g., SN-123456"
              disabled={isSubmitting}
              className="font-mono"
            />
            {errors.serialNumber && (
              <p className="text-sm text-red-600">{errors.serialNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">Asset Tag / SKU *</Label>
            <Input
              id="sku"
              {...register("sku")}
              placeholder="e.g., AST-001"
              disabled={isSubmitting}
              className="font-mono"
            />
            {errors.sku && (
              <p className="text-sm text-red-600">{errors.sku.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Status & Condition Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status & Condition</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={statusValue}
              onValueChange={(value) => setValue("status", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition *</Label>
            <Select
              value={conditionValue}
              onValueChange={(value) => setValue("condition", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_CONDITION.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-sm text-red-600">{errors.condition.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Employee Assignment Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Employee Assignment (Optional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name</Label>
            <Input
              id="employeeName"
              {...register("employeeName")}
              placeholder="e.g., John Smith"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              {...register("employeeId")}
              placeholder="e.g., EMP-1234"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeEmail">Employee Email</Label>
            <Input
              id="employeeEmail"
              type="email"
              {...register("employeeEmail")}
              placeholder="e.g., john@company.com"
              disabled={isSubmitting}
            />
            {errors.employeeEmail && (
              <p className="text-sm text-red-600">{errors.employeeEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={departmentValue}
              onValueChange={(value) => setValue("department", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignmentDate">Assignment Date</Label>
          <Input
            id="assignmentDate"
            type="date"
            {...register("assignmentDate")}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Dates & Warranty Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dates & Warranty</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...register("purchaseDate")}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
            <Input
              id="warrantyExpiry"
              type="date"
              {...register("warrantyExpiry")}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </>
  );
}

