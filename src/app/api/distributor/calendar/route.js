// src/app/api/distributor/calendar/route.js
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = await DistributorDay.find(
    { distributor: user._id },
    { date: 1 }
  );

  return NextResponse.json(
    days.map(d => ({
      date: d.date,
      status: "PRESENT",
    }))
  );
}
