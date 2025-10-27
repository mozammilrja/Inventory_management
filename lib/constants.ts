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

// Status color mapping for UI
export const STATUS_COLORS = {
  Available:
    "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
  Assigned: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  "Under Repair":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300",
  Retired: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
} as const;

// Condition color mapping for UI
export const CONDITION_COLORS = {
  New: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  Good: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  Fair: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  Poor: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
} as const;

// Department color mapping for UI
export const DEPARTMENT_COLORS: Record<string, string> = {
  "IT Department":
    "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
  "Human Resources":
    "bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300",
  Finance:
    "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
  Sales: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  Marketing:
    "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  Operations:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300",
  "Customer Support":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300",
  Management:
    "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
  Administration:
    "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300",
  "Research & Development":
    "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300",
};
