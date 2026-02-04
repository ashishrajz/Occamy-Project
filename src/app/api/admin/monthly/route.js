import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const admin = await getAuthUser(req);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const distributorId = searchParams.get("distributorId");

  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const activities = await Activity.find({
    distributor: distributorId,
    createdAt: { $gte: start, $lt: end },
  });

  const days = await DistributorDay.find({
    distributor: distributorId,
    date: { $gte: month, $lt: `${month}-99` },
  });

  return NextResponse.json({
    meetings: activities.filter(a => a.type.startsWith("MEETING")).length,
    sales: activities.filter(a => a.type === "SALE").length,
    totalQuantity: activities.reduce(
      (s, a) => s + Number(a.sale?.quantity || 0),
      0
    ),
    distance: days.length,
  });
}
