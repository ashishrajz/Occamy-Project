import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ hasEndedToday: false });

  const today = new Date().toISOString().split("T")[0];

  const day = await DistributorDay.findOne({
    distributor: user._id,
    date: today,
    endTime: { $ne: null },
  });

  return NextResponse.json({
    hasEndedToday: !!day,
  });
}
