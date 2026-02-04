import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import Activity from "@/lib/models/Activity";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const day = await DistributorDay.findOne({
    distributor: user._id,
    date: today,
  });

  if (!day) {
    return NextResponse.json({ error: "Day not found" }, { status: 404 });
  }

  const activities = await Activity.find({
    distributor: user._id,
    day: day._id,
  }).sort({ createdAt: 1 });

  let distance = 0;
  for (let i = 1; i < activities.length; i++) {
    const a = activities[i - 1].location;
    const b = activities[i].location;
    if (a && b) {
      distance += haversineDistance(a.lat, a.lng, b.lat, b.lng);
    }
  }

  const summary = {
    meetings: activities.filter(a =>
      a.type.startsWith("MEETING")
    ).length,

    samples: activities.filter(
      a => a.type === "SAMPLE_DISTRIBUTION"
    ).length,

    sales: activities.filter(a => a.type === "SALE").length,

    b2cSales: activities.filter(
      a => a.sale?.mode === "B2C"
    ).length,

    b2bSales: activities.filter(
      a => a.sale?.mode === "B2B"
    ).length,

    totalQuantitySold: activities
      .filter(a => a.sale?.quantity)
      .reduce((sum, a) => sum + Number(a.sale.quantity), 0),

    distanceCoveredKm: distance.toFixed(2),
    activities,
  };

  return NextResponse.json(summary);
}
