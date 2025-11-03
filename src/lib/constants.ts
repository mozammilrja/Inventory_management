// IT Asset Management Constants

export const DEPARTMENTS = [
  "IT Department",
  "Human Resources",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
  "Customer Support",
  "Management",
  "Administration",
  "Research & Development",
] as const;

export const ASSET_TYPES = [
  "Laptop",
  "Desktop Computer",
  "Monitor",
  "Mouse",
  "Keyboard",
  "Headset",
  "Webcam",
  "Docking Station",
  "External Hard Drive",
  "USB Hub",
  "Printer",
  "Scanner",
  "Router",
  "Switch",
  "UPS",
  "Other",
] as const;

export const ASSET_STATUS = [
  "Available",
  "Assigned",
  "Under Repair",
  "Retired",
] as const;

export const ASSET_CONDITION = ["New", "Good", "Fair", "Poor"] as const;

export const BRANDS = [
  "Dell",
  "HP",
  "Lenovo",
  "Apple",
  "Acer",
  "Asus",
  "Microsoft",
  "Samsung",
  "LG",
  "Logitech",
  "Razer",
  "Corsair",
  "Canon",
  "Epson",
  "Cisco",
  "TP-Link",
  "Other",
] as const;

// Type exports
export type Department = (typeof DEPARTMENTS)[number];
export type AssetType = (typeof ASSET_TYPES)[number];
export type AssetStatus = (typeof ASSET_STATUS)[number];
export type AssetCondition = (typeof ASSET_CONDITION)[number];
export type Brand = (typeof BRANDS)[number];

export const STATUS_COLORS:any = {
  Available:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800",
  Assigned:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
  Maintenance:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800",
  Retired:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
};

export const CONDITION_COLORS: any = {
  Excellent:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
  Good: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800",
  Fair: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800",
  Poor: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800",
  Broken:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800",
};

export const DEPARTMENT_COLORS: any = {
  Engineering:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800",
  Sales:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
  Marketing:
    "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-300 dark:border-pink-800",
  HR: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800",
  Finance:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
  Operations:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800",
};
