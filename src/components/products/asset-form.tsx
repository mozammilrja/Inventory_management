"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { AssetFormFields } from "./asset-form-fields";
import {
  updateProductService,
  createProductService,
} from "@/services/product/productService";
import { toast } from "sonner";
import type {
  CreateProductData,
  UpdateProductData,
} from "@/services/product/productService";
interface AssetFormProps {
  asset?: any;
  mode: "create" | "edit";
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AssetForm({ asset, mode, onSuccess, onError }: AssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: asset?.name || "",
      assetType: asset?.assetType || "",
      brand: asset?.brand || "",
      model: asset?.model || asset?.productModel || "",
      serialNumber: asset?.serialNumber || "",
      sku: asset?.sku || "",
      description: asset?.description || "",
      status: asset?.status || "",
      condition: asset?.condition || "",
      location: asset?.location || "",
      price: asset?.price || 0,
      employeeName: asset?.employeeName || "",
      employeeId: asset?.employeeId || "",
      employeeEmail: asset?.employeeEmail || "",
      department: asset?.department || "",
      assignmentDate: asset?.assignmentDate || "",
      purchaseDate: asset?.purchaseDate || "",
      warrantyExpiry: asset?.warrantyExpiry || "",
      notes: asset?.notes || "",
    },
  });

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name || "",
        assetType: asset.assetType || "",
        brand: asset.brand || "",
        model: asset.model || asset.productModel || "",
        serialNumber: asset.serialNumber || "",
        sku: asset.sku || "",
        description: asset.description || "",
        status: asset.status || "",
        condition: asset.condition || "",
        location: asset.location || "",
        price: asset.price || 0,
        employeeName: asset.employeeName || "",
        employeeId: asset.employeeId || "",
        employeeEmail: asset.employeeEmail || "",
        department: asset.department || "",
        assignmentDate: asset.assignmentDate || "",
        purchaseDate: asset.purchaseDate || "",
        warrantyExpiry: asset.warrantyExpiry || "",
        notes: asset.notes || "",
      });
    }
  }, [asset, reset]);

  const onSubmit = async (formData: CreateProductData | UpdateProductData) => {
    try {
      setIsSubmitting(true);
      console.log("🔄 Submitting form data:", formData);

      let response;

      if (mode === "edit" && asset?.id) {
        // For update, ensure we have all required fields with proper types
        const payload: UpdateProductData = {
          id: asset.id,
          name: formData.name || "", // Ensure required fields are not undefined
          assetType: formData.assetType || "",
          ...formData,
        };

        response = await updateProductService(payload); // ✅ Single argument
      } else {
        // For create, ensure all required fields are present
        const payload: CreateProductData = {
          name: formData.name || "", // Ensure required fields are not undefined
          assetType: formData.assetType || "",
          ...formData,
        };

        response = await createProductService(payload);
      }

      console.log("✅ Form submission response:", response);

      if (response?.success) {
        toast.success(
          mode === "edit"
            ? "Asset updated successfully"
            : "Asset created successfully"
        );
        onSuccess?.();
      } else {
        throw new Error(response?.message || `Failed to ${mode} asset`);
      }
    } catch (error: any) {
      console.error("❌ Form submission error:", error);
      const errorMessage = error?.message || `Failed to ${mode} asset`;
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Asset" : "Create New Asset"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AssetFormFields
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            isSubmitting={isSubmitting}
          />

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                ? "Update Asset"
                : "Create Asset"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
