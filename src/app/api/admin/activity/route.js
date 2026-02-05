import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";
import { getDateRange } from "@/lib/dateRange";

export async function GET(req) {
  const admin = await getAuthUser(req);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || "ALL";
  const state = searchParams.get("state") || "ALL";
  const district = searchParams.get("district") || "ALL";
  const range = searchParams.get("range") || "MONTH";

  const rangeData = getDateRange(range);
  if (!rangeData) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  const { start, end } = rangeData;

  /* --------- MATCH --------- */
  const match = {
    createdAt: { $gte: start, $lte: end },
  };

  if (type !== "ALL") match.type = type;
  if (state !== "ALL") match["geo.state"] = state;
  if (district !== "ALL") match["geo.district"] = district;

  const activities = await Activity.find(match)
    .populate("distributor", "name")
    .sort({ createdAt: -1 })
    .limit(200);

  return NextResponse.json(activities);
}
