import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // YYYY-MM

  if (!month) {
    return NextResponse.json(
      { error: "Month required" },
      { status: 400 }
    );
  }

  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const activities = await Activity.find({
    distributor: user._id,
    createdAt: { $gte: start, $lt: end },
  });

  const days = await DistributorDay.find({
    distributor: user._id,
    date: {
      $gte: month,
      $lt: `${month}-99`,
    },
  });

  const meetings = activities.filter(a =>
    a.type.startsWith("MEETING")
  ).length;

  const sales = activities.filter(a => a.type === "SALE");
  const totalQuantity = sales.reduce(
    (sum, s) => sum + Number(s.sale?.quantity || 0),
    0
  );

  return NextResponse.json({
    meetings,
    sales: sales.length,
    totalQuantity,
    distance: days.length, // placeholder, can extend
  });
}
