import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const admin = await getAuthUser(req);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json([], { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const distributorId = searchParams.get("distributorId");

  if (!distributorId) {
    return NextResponse.json([]);
  }

  const days = await DistributorDay.find(
    { distributor: distributorId },
    { date: 1, endTime: 1 }
  );

  // 🔑 Explicit, deterministic output
  const result = days.map(d => ({
    date: d.date,               // "YYYY-MM-DD"
    status: "PRESENT",           // existence = present
    active: d.endTime === null,  // optional
  }));

  return NextResponse.json(result);
}
