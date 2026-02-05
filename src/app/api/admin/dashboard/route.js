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
  const state = searchParams.get("state") || "ALL";
  const district = searchParams.get("district") || "ALL";

  /* ---------------- DATE RANGE ---------------- */
  const rangeData = getDateRange(range);
  if (!rangeData) {
    return NextResponse.json(
      { error: "Invalid date range" },
      { status: 400 }
    );
  }

  let { start, end } = rangeData;

  // 🔥 CRITICAL FIX: include entire end day
  end = new Date(end);
  end.setHours(23, 59, 59, 999);

  /* ---------------- VALID DAYS ---------------- */
  const validDays = await DistributorDay.find({
    date: {
      $gte: start.toISOString().split("T")[0],
      $lte: end.toISOString().split("T")[0],
    },
  }).select("_id distributor endTime");

  const dayIds = validDays.map(d => d._id);

  /* ---------------- BASE MATCH ---------------- */
  const baseMatch = {
    day: { $in: dayIds },
  };

  if (state !== "ALL") baseMatch["geo.state"] = state;
  if (district !== "ALL") baseMatch["geo.district"] = district;

  /* ---------------- DATE MATCH (FUNNELS) ---------------- */
  const dateMatch = {
    createdAt: { $gte: start, $lte: end },
  };

  if (state !== "ALL") dateMatch["geo.state"] = state;
  if (district !== "ALL") dateMatch["geo.district"] = district;

  /* ---------------- CONVERSION FUNNEL ---------------- */
  const sampleCount =
    (await Activity.countDocuments({
      ...dateMatch,
      type: "SAMPLE_DISTRIBUTION",
    })) || 0;

  const followUpSales =
    (await Activity.countDocuments({
      ...dateMatch,
      type: "SALE",
      "sale.isFollowUpSale": true,
    })) || 0;

  /* ---------------- NEW vs REPEAT ORDERS ---------------- */
  const newOrders =
    (await Activity.countDocuments({
      ...dateMatch,
      type: "SALE",
      "sale.isRepeatOrder": false,
    })) || 0;

  const repeatOrders =
    (await Activity.countDocuments({
      ...dateMatch,
      type: "SALE",
      "sale.isRepeatOrder": true,
    })) || 0;

  /* ---------------- KPIs ---------------- */
  const [
    meetings,
    sales,
    samples,
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
    User.countDocuments({ role: "DISTRIBUTOR" }),
  ]);

  const activeToday = validDays.filter(d => !d.endTime).length;
  const distanceDays = validDays.filter(d => d.endTime).length;

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
  const distributorPerformance = await Activity.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: "$distributor",
        meetings: {
          $sum: {
            $cond: [
              { $regexMatch: { input: "$type", regex: "^MEETING" } },
              1,
              0,
            ],
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
    ...baseMatch,
    "geo.state": { $ne: "" },
  });

  const districts = await Activity.distinct("geo.district", {
    ...baseMatch,
    "geo.district": { $ne: "" },
  });

  return NextResponse.json({
    kpis: {
      distributors,
      activeToday,
      meetings,
      sales,
      samples,
      distance: distanceDays,
    },

    conversionFunnel: [
      { name: "Samples Given", value: sampleCount },
      { name: "Follow-up Sales", value: followUpSales },
    ],

    orderSplit: [
      { name: "New Orders", value: newOrders },
      { name: "Repeat Orders", value: repeatOrders },
    ],

    states,
    districts,

    b2bVsB2c: b2Split,
    productSales,
    customerCategorySplit: customerCategory,
    stateWiseSales: stateWise,
    distributorPerformance,
  });
}
