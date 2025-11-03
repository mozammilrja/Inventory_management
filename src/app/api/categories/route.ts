import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// Simple in-memory cache (for production, use Redis)
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cache.data,
        total: cache.data.length,
        timestamp: new Date(cache.timestamp).toISOString(),
        cached: true,
      });
    }

    await connectDB();

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: {
            $ifNull: ["$category", "$assetType", "Uncategorized"],
          },
          count: { $sum: 1 },
          totalStock: { $sum: { $ifNull: ["$quantity", 0] } },
          totalValue: {
            $sum: {
              $multiply: [
                { $ifNull: ["$price", 0] },
                { $ifNull: ["$quantity", 1] },
              ],
            },
          },
          lowStock: {
            $sum: {
              $cond: [{ $lt: [{ $ifNull: ["$quantity", 0] }, 20] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          totalStock: 1,
          totalValue: 1,
          lowStock: 1,
          _id: 0,
        },
      },
      {
        $sort: { category: 1 },
      },
    ]);

    // Update cache
    cache = {
      data: categoryStats,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: categoryStats,
      total: categoryStats.length,
      timestamp: new Date().toISOString(),
      cached: false,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        data: [],
      },
      { status: 500 }
    );
  }
}
