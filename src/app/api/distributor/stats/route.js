// src/app/api/distributor/stats/route.js
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activities = await Activity.find({ distributor: user._id });
  const days = await DistributorDay.find({ distributor: user._id });

  const totalDistance = days.reduce(
    (sum, d) => sum + (d.distanceCoveredKm || 0),
    0
  );

  const meetings = activities.filter(a =>
    a.type.startsWith("MEETING")
  );

  const sales = activities.filter(a => a.type === "SALE");

  const b2c = sales.filter(s => s.sale?.mode === "B2C").length;
  const b2b = sales.filter(s => s.sale?.mode === "B2B").length;

  // State & village aggregation
  const regionStats = {};
  activities.forEach(a => {
    const village = a.meeting?.village;
    if (village) {
      regionStats[village] = (regionStats[village] || 0) + 1;
    }
  });

  return NextResponse.json({
    totalDistance,
    meetingsCount: meetings.length,
    farmersContacted: meetings.filter(
      m => m.meeting?.category === "FARMER"
    ).length,
    salesCount: sales.length,
    b2c,
    b2b,
    regionStats,
    totalDaysWorked: days.length,
  });
}
