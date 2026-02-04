import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import { autoClosePreviousDay } from "@/lib/autoCloseDay";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json(null);
  }

  // 🔑 auto-close yesterday if needed
  await autoClosePreviousDay(user._id);

  const today = new Date().toISOString().split("T")[0];

  const day = await DistributorDay.findOne({
    distributor: user._id,
    date: today,
    endTime: null, // 🔥 THIS LINE IS THE FIX
  });

  return NextResponse.json(day);
}
