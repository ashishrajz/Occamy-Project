import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import Activity from "@/lib/models/Activity";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date is required" },
      { status: 400 }
    );
  }

  const day = await DistributorDay.findOne({
    distributor: user._id,
    date,
  });

  if (!day) {
    return NextResponse.json(
      { error: "No work done on this day" },
      { status: 404 }
    );
  }

  const activities = await Activity.find({
    distributor: user._id,
    day: day._id,
  }).sort({ createdAt: 1 });

  return NextResponse.json({
    date,
    startTime: day.startTime,
    endTime: day.endTime,
    activities,
    meetings: activities.filter(a =>
      a.type.startsWith("MEETING")
    ).length,
    samples: activities.filter(
      a => a.type === "SAMPLE_DISTRIBUTION"
    ).length,
    sales: activities.filter(a => a.type === "SALE").length,
  });
}
