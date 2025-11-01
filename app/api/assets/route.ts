import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// 🧩 Define response structure
interface AssetStatsResponse {
  totalAssets: number;
  assigned: number;
  available: number;
  underRepair: number;
  retired: number;
  totalValue: string;
}

// 💰 Helper to format total value (e.g., 1320000 → "$1.32M")
function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

// 🚀 GET /api/assets — Compute overall asset stats
export async function GET(): Promise<
  NextResponse<AssetStatsResponse | { error: string }>
> {
  try {
    // 🧩 Connect to MongoDB
    await connectDB();

    // 🧮 Fetch ALL assets (no pagination)
    const products = await Product.find({}).lean();

    // 📊 Compute stats from all assets
    const totalAssets = products.length;
    const totalValueRaw = products.reduce((sum, p) => sum + (p.price || 0), 0);

    // 🧱 Count by status
    let assigned = 0;
    let available = 0;
    let underRepair = 0;
    let retired = 0;

    for (const p of products) {
      switch (p.status) {
        case "Assigned":
          assigned++;
          break;
        case "Available":
          available++;
          break;
        case "Under Repair":
          underRepair++;
          break;
        case "Retired":
          retired++;
          break;
      }
    }

    // ✅ Return computed stats (no product data)
    const result: AssetStatsResponse = {
      totalAssets,
      assigned,
      available,
      underRepair,
      retired,
      totalValue: formatCurrency(totalValueRaw),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Error fetching asset stats:", error);
    return NextResponse.json(
      { error: error.message || "Failed to compute asset stats" },
      { status: 500 }
    );
  }
}
