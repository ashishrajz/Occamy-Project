import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";
import DistributorDay from "@/lib/models/DistributorDay";
import User from "@/lib/models/User";
import { getDateRange } from "@/lib/dateRange";

export async function GET(req) {
  const admin = await getAuthUser(req);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "MONTH";
  const state = searchParams.get("state");
  const district = searchParams.get("district");

  const rangeData = getDateRange(range);

if (!rangeData) {
  return NextResponse.json(
    { error: "Invalid date range" },
    { status: 400 }
  );
}

const { start, end } = rangeData;


  /* ---------------- BASE MATCH ---------------- */
  const baseMatch = {
    createdAt: { $gte: start, $lte: end },
  };

  if (state && state !== "ALL") {
    baseMatch["geo.state"] = state;
  }
  if (district && district !== "ALL") {
    baseMatch["geo.district"] = district;
  }

  const sampleCount = await Activity.countDocuments({
    ...baseMatch,
    type: "SAMPLE_DISTRIBUTION",
  });
  
  const followUpSales = await Activity.countDocuments({
    ...baseMatch,
    type: "SALE",
    "sale.isFollowUpSale": true,
  });
  

  /* ---------------- KPIs ---------------- */
  const [
    meetings,
    sales,
    samples,
    distanceDays,
    distributors,
  ] = await Promise.all([
    Activity.countDocuments({
      ...baseMatch,
      type: { $regex: "^MEETING" },
    }),
    Activity.countDocuments({ ...baseMatch, type: "SALE" }),
    Activity.countDocuments({
      ...baseMatch,
      type: "SAMPLE_DISTRIBUTION",
    }),
    DistributorDay.find({
      date: { $gte: start, $lte: end },
      endTime: { $ne: null },
    }),
    User.countDocuments({ role: "DISTRIBUTOR" }),
  ]);

  /* ---------------- B2C vs B2B ---------------- */
  const b2Split = await Activity.aggregate([
    { $match: { ...baseMatch, type: "SALE" } },
    {
      $group: {
        _id: "$sale.mode",
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        name: "$_id",
        value: 1,
        _id: 0,
      },
    },
  ]);

  /* ---------------- PRODUCT SALES ---------------- */
  const productSales = await Activity.aggregate([
    { $match: { ...baseMatch, type: "SALE" } },
    {
      $group: {
        _id: "$sale.productId",
        quantity: { $sum: "$sale.quantity" },
      },
    },
    {
      $project: {
        name: "$_id",
        quantity: 1,
        _id: 0,
      },
    },
  ]);

  /* ---------------- CUSTOMER CATEGORY ---------------- */
  const customerCategory = await Activity.aggregate([
    { $match: { ...baseMatch, type: "SALE" } },
    {
      $group: {
        _id: "$sale.customerCategory",
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        name: "$_id",
        value: 1,
        _id: 0,
      },
    },
  ]);

  /* ---------------- STATE WISE SALES ---------------- */
  const stateWise = await Activity.aggregate([
    { $match: { ...baseMatch, type: "SALE" } },
    {
      $group: {
        _id: "$geo.state",
        sales: { $sum: 1 },
      },
    },
    {
      $project: {
        name: "$_id",
        sales: 1,
        _id: 0,
      },
    },
  ]);

  /* ---------------- DISTRIBUTOR PERFORMANCE ---------------- */
  const distributorPerf = await Activity.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: "$distributor",
        meetings: {
          $sum: {
            $cond: [{ $regexMatch: { input: "$type", regex: "^MEETING" } }, 1, 0],
          },
        },
        sales: {
          $sum: { $cond: [{ $eq: ["$type", "SALE"] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        name: "$user.name",
        meetings: 1,
        sales: 1,
      },
    },
  ]);
  /* ---------------- STATES & DISTRICTS ---------------- */
const states = await Activity.distinct("geo.state", {
    "geo.state": { $ne: "" },
  });
  
  const districts = await Activity.distinct("geo.district", {
    "geo.district": { $ne: "" },
  });
  

  return NextResponse.json({
    kpis: {
      distributors,
      meetings,
      sales,
      samples,
      distance: distanceDays.length,
    },

    conversionFunnel: [
        { name: "Samples Given", value: sampleCount },
        { name: "Follow-up Sales", value: followUpSales },
      ],
      
  
    states,
    districts,
  
    b2bVsB2c: b2Split,
    productSales,
    customerCategorySplit: customerCategory,
    stateWiseSales: stateWise,
    distributorPerformance: distributorPerf,
  });
}
