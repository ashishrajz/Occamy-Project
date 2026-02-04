import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import Activity from "@/lib/models/Activity";
import cloudinary from "@/lib/cloudinary";
import { reverseGeocode } from "@/lib/geocode";
import { autoClosePreviousDay } from "@/lib/autoCloseDay";


export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await autoClosePreviousDay(user._id);

  const today = new Date().toISOString().split("T")[0];
  const day = await DistributorDay.findOne({
    distributor: user._id,
    date: today,
  });

  if (!day) {
    return NextResponse.json(
      { error: "Start day first" },
      { status: 400 }
    );
  }

  const formData = await req.formData();

  // Upload images to Cloudinary
  const photos = [];
  const files = formData.getAll("photos");

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      { folder: "distributor-logs" }
    );
    photos.push(upload.secure_url);
  }


  const lat = Number(formData.get("lat"));
const lng = Number(formData.get("lng"));

const geo = await reverseGeocode(lat, lng);

  const activity = await Activity.create({
    distributor: user._id,
    day: day._id,
    type: formData.get("type"),
    location: { lat, lng },
    address: geo?.displayName || "Unknown location",
    meeting: JSON.parse(formData.get("meeting") || "{}"),
    sample: JSON.parse(formData.get("sample") || "{}"),
    sale: JSON.parse(formData.get("sale") || "{}"),
    odometerReading: formData.get("odometer"),
    notes: formData.get("notes"),
    photos,
  });

  return NextResponse.json(activity);
}
