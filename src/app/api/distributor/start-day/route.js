import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import { autoClosePreviousDay } from "@/lib/autoCloseDay";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await autoClosePreviousDay(user._id);

  const today = new Date().toISOString().split("T")[0];

  // 🔥 HARD BLOCK
  const existingDay = await DistributorDay.findOne({
    distributor: user._id,
    date: today,
  });

  if (existingDay) {
    return NextResponse.json(
      { error: "Day already exists for today" },
      { status: 400 }
    );
  }

  const { location } = await req.json();

  const day = await DistributorDay.create({
    distributor: user._id,
    date: today,
    startTime: new Date(),
    startLocation: location,
  });

  return NextResponse.json(day);
}
