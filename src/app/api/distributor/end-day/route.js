import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import { reverseGeocode } from "@/lib/geocode";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { lat, lng } = body.location;

  const geo = await reverseGeocode(lat, lng);

  const today = new Date().toISOString().split("T")[0];

  const day = await DistributorDay.findOne({
    distributor: user._id,
    date: today,
  });

  if (!day) {
    return NextResponse.json(
      { error: "Day not started" },
      { status: 400 }
    );
  }

  day.endTime = new Date();
  day.endLocation = { lat, lng };
  day.endAddress = geo?.displayName || "Unknown location";

  await day.save();

  return NextResponse.json({ message: "Day ended successfully" });
}
