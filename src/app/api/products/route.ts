import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// Cache for frequent queries
const cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

// 🧩 Get ALL Products with Search, Filtering, Pagination, Sorting, and KPIs
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // 🎯 Parse all query parameters with proper defaults
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const assetType = searchParams.get("assetType") || "";
    const status = searchParams.get("status") || "";
    const condition = searchParams.get("condition") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Additional sorting parameters from frontend
    const sortBy = searchParams.get("sortBy") || sortField;
    const sortDirection =
      searchParams.get("sortOrder") || (sortOrder === 1 ? "asc" : "desc");

    // Create cache key
    const cacheKey = JSON.stringify({
      search,
      department,
      assetType,
      status,
      condition,
      startDate,
      endDate,
      page,
      limit,
      sortBy,
      sortDirection,
    });

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const filter: any = {};

    // 🔍 Search across multiple fields with improved logic
    if (search && search.trim() !== "") {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { serialNumber: searchRegex },
        { employeeName: searchRegex },
        { employeeId: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { sku: searchRegex },
        { description: searchRegex },
        { notes: searchRegex },
        { location: searchRegex },
      ];
    }

    // 🎯 Exact match filters (ignore "all" values)
    if (department && department !== "all") filter.department = department;
    if (assetType && assetType !== "all") filter.assetType = assetType;
    if (status && status !== "all") filter.status = status;
    if (condition && condition !== "all") filter.condition = condition;

    // 📅 Date range filter with validation
    if (startDate || endDate) {
      filter.purchaseDate = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) filter.purchaseDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) filter.purchaseDate.$lte = end;
      }
    }

    // Determine sort field and direction
    const finalSortField = sortBy || sortField;
    const finalSortDirection = sortDirection === "asc" ? 1 : -1;

    // 🚀 Execute queries in parallel for maximum performance
    const [total, products, aggregates] = await Promise.all([
      // Count total documents matching filter
      Product.countDocuments(filter),

      // Get paginated products with sorting
      Product.find(filter)
        .sort({ [finalSortField]: finalSortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      // Get aggregated stats in single query
      Product.aggregate([
        { $match: filter },
        {
          $facet: {
            // Total value calculation
            totalValue: [
              {
                $group: {
                  _id: null,
                  totalValue: { $sum: { $ifNull: ["$price", 0] } },
                },
              },
            ],
            // Status distribution
            statusData: [
              {
                $group: {
                  _id: { $ifNull: ["$status", "Unknown"] },
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
            ],
            // Condition distribution
            conditionData: [
              {
                $group: {
                  _id: { $ifNull: ["$condition", "Unknown"] },
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
            ],
            // Asset type distribution
            assetTypeData: [
              {
                $group: {
                  _id: { $ifNull: ["$assetType", "Unknown"] },
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
            ],
            // Department distribution
            departmentData: [
              {
                $group: {
                  _id: { $ifNull: ["$department", "Unassigned"] },
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
            ],
            // Additional KPIs
            additionalStats: [
              {
                $group: {
                  _id: null,
                  assignedCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Assigned"] }, 1, 0] },
                  },
                  availableCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Available"] }, 1, 0] },
                  },
                  underRepairCount: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "Under Repair"] }, 1, 0],
                    },
                  },
                  retiredCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Retired"] }, 1, 0] },
                  },
                  avgPrice: { $avg: { $ifNull: ["$price", 0] } },
                  maxPrice: { $max: { $ifNull: ["$price", 0] } },
                  minPrice: { $min: { $ifNull: ["$price", 0] } },
                },
              },
            ],
          },
        },
      ]),
    ]);

    const aggregatesResult = aggregates[0];

    // 📊 Extract and transform aggregated data
    const totalValue = aggregatesResult.totalValue[0]?.totalValue || 0;
    const additionalStats = aggregatesResult.additionalStats[0] || {};

    // Transform aggregated data with proper fallbacks
    const statusData = (aggregatesResult.statusData || []).map((s: any) => ({
      name: s._id || "Unknown",
      count: s.count || 0,
    }));

    const conditionData = (aggregatesResult.conditionData || []).map(
      (c: any) => ({
        name: c._id || "Unknown",
        count: c.count || 0,
      })
    );

    const assetTypeData = (aggregatesResult.assetTypeData || []).map(
      (a: any) => ({
        name: a._id || "Unknown",
        count: a.count || 0,
      })
    );

    const departmentData = (aggregatesResult.departmentData || []).map(
      (d: any) => ({
        name: d._id || "Unassigned",
        count: d.count || 0,
      })
    );

    // 🎯 Transform products data with proper error handling
    const productsData = products.map((product: any) => ({
      id: product._id?.toString() || `temp-${Math.random()}`,
      name: product.name || "Unnamed Asset",
      assetType: product.assetType || "Unknown",
      serialNumber: product.serialNumber || "N/A",
      brand: product.brand || "",
      productModel: product.model || product.productModel || "",
      sku: product.sku || "",
      status: product.status || "Available",
      condition: product.condition || "Good",
      employeeName: product.employeeName || "",
      employeeId: product.employeeId || "",
      employeeEmail: product.employeeEmail || "",
      department: product.department || "",
      assignmentDate: product.assignmentDate || null,
      returnDate: product.returnDate || null,
      purchaseDate: product.purchaseDate || null,
      warrantyExpiry: product.warrantyExpiry || null,
      location: product.location || "",
      price: product.price || 0,
      description: product.description || "",
      image: product.image || "",
      notes: product.notes || "",
      category: product.category || product.assetType || "",
      quantity: product.quantity || 1,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    }));

    // 📈 Calculate comprehensive KPI stats
    const assignedCount =
      additionalStats.assignedCount ||
      statusData.find((s: any) => s.name === "Assigned")?.count ||
      0;

    const availableCount =
      additionalStats.availableCount ||
      statusData.find((s: any) => s.name === "Available")?.count ||
      0;

    const underRepairCount =
      additionalStats.underRepairCount ||
      statusData.find((s: any) => s.name === "Under Repair")?.count ||
      0;

    const retiredCount =
      additionalStats.retiredCount ||
      statusData.find((s: any) => s.name === "Retired")?.count ||
      0;

    const stats = {
      // Basic counts
      total,
      totalValue,
      assigned: assignedCount,
      available: availableCount,
      underRepair: underRepairCount,
      retired: retiredCount,

      // Distribution data
      statusData,
      conditionData,
      assetTypeData,
      departmentData,

      // Additional metrics
      avgPrice: additionalStats.avgPrice || 0,
      maxPrice: additionalStats.maxPrice || 0,
      minPrice: additionalStats.minPrice || 0,

      // Pagination context
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    // 📄 Build pagination info
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    const responseData = {
      success: true,
      data: productsData,
      pagination,
      stats,
      filters: {
        search,
        department,
        assetType,
        status,
        condition,
        startDate,
        endDate,
        sortBy: finalSortField,
        sortDirection: sortDirection,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        cache: "miss",
        executionTime: Date.now(),
      },
    };

    // 💾 Cache the response
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    });

    return NextResponse.json(responseData);
  } catch (err: any) {
    console.error("❌ Error fetching products:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        stats: {
          total: 0,
          totalValue: 0,
          assigned: 0,
          available: 0,
          underRepair: 0,
          retired: 0,
          statusData: [],
          conditionData: [],
          assetTypeData: [],
          departmentData: [],
          avgPrice: 0,
          maxPrice: 0,
          minPrice: 0,
        },
      },
      { status: 500 }
    );
  }
}

// 🧩 CREATE New Product
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🎯 Handle Clear Cache Action
    if (body.action === "clearCache") {
      const cacheSize = cache.size;
      cache.clear();

      return NextResponse.json({
        success: true,
        message: `Cache cleared successfully (${cacheSize} entries removed)`,
        cacheSizeBefore: cacheSize,
      });
    }

    // 🎯 Handle Add Product Action (default)
    if (!body.name || !body.assetType) {
      return NextResponse.json(
        { error: "Name and asset type are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newProduct = await Product.create({
      name: body.name,
      assetType: body.assetType,
      serialNumber: body.serialNumber,
      brand: body.brand,
      model: body.model,
      sku: body.sku,
      status: body.status || "Available",
      condition: body.condition || "Good",
      employeeName: body.employeeName,
      employeeId: body.employeeId,
      employeeEmail: body.employeeEmail,
      department: body.department,
      assignmentDate: body.assignmentDate,
      returnDate: body.returnDate,
      purchaseDate: body.purchaseDate,
      warrantyExpiry: body.warrantyExpiry,
      location: body.location,
      price: body.price || 0,
      description: body.description,
      image: body.image,
      notes: body.notes,
      category: body.assetType,
      quantity: body.quantity || (body.status === "Available" ? 1 : 0),
    });

    const productData = {
      id: newProduct._id.toString(),
      name: newProduct.name,
      assetType: newProduct.assetType,
      serialNumber: newProduct.serialNumber,
      brand: newProduct.brand,
      model: newProduct.model,
      sku: newProduct.sku,
      status: newProduct.status,
      condition: newProduct.condition,
      employeeName: newProduct.employeeName,
      employeeId: newProduct.employeeId,
      employeeEmail: newProduct.employeeEmail,
      department: newProduct.department,
      assignmentDate: newProduct.assignmentDate,
      returnDate: newProduct.returnDate,
      purchaseDate: newProduct.purchaseDate,
      warrantyExpiry: newProduct.warrantyExpiry,
      location: newProduct.location,
      price: newProduct.price,
      description: newProduct.description,
      image: newProduct.image,
      notes: newProduct.notes,
      category: newProduct.category,
      quantity: newProduct.quantity,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt,
    };

    // Clear cache when new data is added
    cache.clear();

    return NextResponse.json(productData);
  } catch (err: any) {
    console.error("❌ Error in POST request:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
