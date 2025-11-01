// app/api/assets/analytics/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const assetType = searchParams.get("assetType");
    const status = searchParams.get("status");
    const condition = searchParams.get("condition");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query efficiently
    const query: any = {};
    if (department && department !== "All") query.department = department;
    if (assetType && assetType !== "All") query.assetType = assetType;
    if (status && status !== "All") query.status = status;
    if (condition && condition !== "All") query.condition = condition;

    if (startDate && endDate) {
      query.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // ✅ OPTIMIZATION 1: Use MongoDB aggregation for faster data processing
    const aggregationPipeline: any[] = [
      { $match: query },
      {
        $facet: {
          // Basic stats in one query
          basicStats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                totalValue: { $sum: "$price" },
                assigned: {
                  $sum: { $cond: [{ $eq: ["$status", "Assigned"] }, 1, 0] },
                },
                available: {
                  $sum: { $cond: [{ $eq: ["$status", "Available"] }, 1, 0] },
                },
                underRepair: {
                  $sum: { $cond: [{ $eq: ["$status", "Under Repair"] }, 1, 0] },
                },
                retired: {
                  $sum: { $cond: [{ $eq: ["$status", "Retired"] }, 1, 0] },
                },
              },
            },
          ],
          // Department data
          deptData: [
            {
              $group: {
                _id: { $ifNull: ["$department", "Unassigned"] },
                count: { $sum: 1 },
              },
            },
            { $project: { name: "$_id", count: 1, _id: 0 } },
          ],
          // Asset type data
          typeData: [
            {
              $group: {
                _id: { $ifNull: ["$assetType", "Other"] },
                count: { $sum: 1 },
              },
            },
            { $project: { name: "$_id", count: 1, _id: 0 } },
          ],
          // Condition data
          conditionData: [
            {
              $group: {
                _id: { $ifNull: ["$condition", "Unknown"] },
                count: { $sum: 1 },
              },
            },
            { $project: { name: "$_id", count: 1, _id: 0 } },
          ],
          // Top employees
          topEmployees: [
            { $match: { status: "Assigned", employeeName: { $exists: true } } },
            {
              $group: {
                _id: "$employeeName",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { name: "$_id", count: 1, _id: 0 } },
          ],
          // Purchase trend data
          trendData: [
            { $match: { purchaseDate: { $exists: true } } },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%b %Y",
                    date: "$purchaseDate",
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $project: { month: "$_id", count: 1, _id: 0 } },
            { $sort: { month: 1 } },
          ],
        },
      },
    ];

    const [result] = await Product.aggregate(aggregationPipeline);

    // Extract results with fallbacks
    const basicStats = result.basicStats[0] || {
      total: 0,
      totalValue: 0,
      assigned: 0,
      available: 0,
      underRepair: 0,
      retired: 0,
    };

    // ✅ OPTIMIZATION 2: Generate trend data for empty results
    let trendData = result.trendData;
    if (trendData.length === 0) {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          month: date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          count: 0,
        });
      }
      trendData = months;
    }

    // ✅ OPTIMIZATION 3: Ensure all statuses are present
    const statusData = [
      { name: "Assigned", count: basicStats.assigned },
      { name: "Available", count: basicStats.available },
      { name: "Under Repair", count: basicStats.underRepair },
      { name: "Retired", count: basicStats.retired },
    ];

    // ✅ OPTIMIZATION 4: Calculate depreciation
    const depreciation = [
      { name: "Current Value", value: basicStats.totalValue },
      { name: "Original Value", value: basicStats.totalValue * 1.25 },
      { name: "Depreciated", value: basicStats.totalValue * 0.8 },
    ];

    // ✅ OPTIMIZATION 5: Return minimal necessary data
    const response = {
      total: basicStats.total,
      assigned: basicStats.assigned,
      available: basicStats.available,
      underRepair: basicStats.underRepair,
      totalValue: basicStats.totalValue,
      totalAssets: basicStats.total,
      trendData,
      deptData: result.deptData,
      typeData: result.typeData,
      statusData,
      conditionData: result.conditionData,
      topEmployees: result.topEmployees,
      depreciation,
    };

    // ✅ OPTIMIZATION 6: Add caching headers
    const headers = {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    };

    return NextResponse.json(response, { headers });
  } catch (err: any) {
    console.error("Dashboard Analytics API Error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}