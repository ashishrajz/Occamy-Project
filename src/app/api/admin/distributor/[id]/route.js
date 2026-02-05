import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import User from "@/lib/models/User";
import Activity from "@/lib/models/Activity";
import DistributorDay from "@/lib/models/DistributorDay";

export async function GET(req, ctx) {
  const admin = await getAuthUser(req);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const activities = await Activity.find({ distributor: id });
  const days = await DistributorDay.find({ distributor: id });

  const meetings = activities.filter(a =>
    a.type.startsWith("MEETING")
  );

  const sales = activities.filter(a =>
    a.type === "SALE"
  );

  const samples = activities.filter(a =>
    a.type === "SAMPLE_DISTRIBUTION"
  );

  return NextResponse.json({
    profile: {
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    },
    stats: {
      totalDistance: days.length,
      meetingsCount: meetings.length,
      samplesCount: samples.length,          // ✅ FIX
      farmersContacted: meetings.filter(
        a => a.meeting?.category === "FARMER"
      ).length,
      salesCount: sales.length,
      b2c: sales.filter(a => a.sale?.mode === "B2C").length,
      b2b: sales.filter(a => a.sale?.mode === "B2B").length,
      totalDaysWorked: days.length,
    },
  });
}
