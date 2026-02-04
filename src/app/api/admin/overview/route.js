import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import User from "@/lib/models/User";
import DistributorDay from "@/lib/models/DistributorDay";
import Activity from "@/lib/models/Activity";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const distributors = await User.find({ role: "DISTRIBUTOR" });

  const activeDays = await DistributorDay.find({
    date: today,
    endTime: null,
  });

  const activitiesToday = await Activity.find({
    createdAt: {
      $gte: new Date(`${today}T00:00:00`),
      $lte: new Date(`${today}T23:59:59`),
    },
  });

  const sales = activitiesToday.filter(a => a.type === "SALE");

  return NextResponse.json({
    totalDistributors: distributors.length,
    activeToday: activeDays.length,
    meetingsToday: activitiesToday.filter(a =>
      a.type.startsWith("MEETING")
    ).length,
    distanceToday: activeDays.length, // can refine later
    b2c: sales.filter(s => s.sale?.mode === "B2C").length,
    b2b: sales.filter(s => s.sale?.mode === "B2B").length,
  });
}
