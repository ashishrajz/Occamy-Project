import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const admin = await getAuthUser(req);

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const activities = await Activity.find({});
  const days = await DistributorDay.find({});

  const meetings = activities.filter(a =>
    a.type.startsWith("MEETING")
  );

  const sales = activities.filter(a => a.type === "SALE");

  const b2c = sales.filter(
    s => s.sale?.mode === "B2C"
  ).length;

  const b2b = sales.filter(
    s => s.sale?.mode === "B2B"
  ).length;

  const farmersContacted = meetings.filter(
    m => m.meeting?.category === "FARMER"
  ).length;

  const farmersConverted = sales.filter(
    s => s.sale?.mode === "B2C"
  ).length;

  // Distance calculation placeholder (can be refined later)
  const totalDistance = days.length;

  return NextResponse.json({
    meetings: meetings.length,
    sales: sales.length,
    b2c,
    b2b,
    farmersContacted,
    farmersConverted,
    distance: totalDistance,
  });
}
