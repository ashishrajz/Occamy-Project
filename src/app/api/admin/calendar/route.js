import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const admin = await getAuthUser(req);

  // 🔑 ALWAYS return array
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json([]);
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

  return NextResponse.json(
    days.map(d => ({
      date: d.date,
      status: d.endTime ? "PRESENT" : "ACTIVE",
    }))
  );
}
