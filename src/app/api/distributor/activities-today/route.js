import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import Activity from "@/lib/models/Activity";
import { autoClosePreviousDay } from "@/lib/autoCloseDay";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json([]);
  }
  await autoClosePreviousDay(user._id);

  const today = new Date().toISOString().split("T")[0];

  const day = await DistributorDay.findOne({
    distributor: user._id,
    date: today,
    endTime: null,
  });

  if (!day) {
    return NextResponse.json([]); // 🔑 important
  }

  const activities = await Activity.find({
    distributor: user._id,
    day: day._id,
  }).sort({ createdAt: -1 });

  return NextResponse.json(activities);
}
