import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import Activity from "@/lib/models/Activity";

export async function GET(req) {
  const admin = await getAuthUser(req);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const distributorId = searchParams.get("distributorId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!distributorId || !date) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const day = await DistributorDay.findOne({
    distributor: distributorId,
    date,
  });

  if (!day) {
    return NextResponse.json({ absent: true });
  }

  const activities = await Activity.find({
    distributor: distributorId,
    day: day._id,
  }).sort({ createdAt: 1 });

  /* ---------------- SUMMARY ---------------- */

  const meetings = activities.filter(a =>
    a.type.startsWith("MEETING")
  );

  const sales = activities.filter(a =>
    a.type === "SALE"
  );

  const samples = activities.filter(a =>
    a.type === "SAMPLE_DISTRIBUTION"   // ✅ FIX
  );

  const b2c = sales.filter(s => s.sale?.mode === "B2C").length;
  const b2b = sales.filter(s => s.sale?.mode === "B2B").length;

  /* ---------------- MAP ---------------- */

  const mapActivities = activities
    .filter(a => a.location?.lat && a.location?.lng)
    .map(a => ({
      location: {
        lat: a.location.lat,
        lng: a.location.lng,
      },
      type: a.type,
      createdAt: a.createdAt,
    }));

  return NextResponse.json({
    absent: false,
    summary: {
      meetings: meetings.length,
      sales: sales.length,
      samples: samples.length,          // ✅ now correct
      b2c,
      b2b,
      firstActivity: activities[0]?.createdAt || null,
      lastActivity:
        activities[activities.length - 1]?.createdAt || null,
    },
    mapActivities,
    activities,
  });
}
