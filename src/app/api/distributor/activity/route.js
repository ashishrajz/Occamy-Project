import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import DistributorDay from "@/lib/models/DistributorDay";
import Activity from "@/lib/models/Activity";
import cloudinary from "@/lib/cloudinary";
import { reverseGeocode } from "@/lib/geocode";
import { autoClosePreviousDay } from "@/lib/autoCloseDay";

const VALID_PRODUCTS = [
  "RAKSHAK",
  "BOVI_BOOSTER",
  "JODI_NO_1",
  "BUCK_BOOSTER",
];

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
  const type = formData.get("type");

  const meeting = formData.get("meeting")
    ? JSON.parse(formData.get("meeting"))
    : null;

  const sample = formData.get("sample")
    ? JSON.parse(formData.get("sample"))
    : null;

  const sale = formData.get("sale")
    ? JSON.parse(formData.get("sale"))
    : null;

  /* ================= GEO ================= */
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));

  const geo = await reverseGeocode(lat, lng);
  const geoData = geo
    ? {
        state: geo.state || "",
        district: geo.district || "",
        village: geo.village || "",
      }
    : {};

  /* ================= VALIDATION ================= */

  if (type.startsWith("MEETING")) {
    if (!meeting?.personName || !meeting?.intent) {
      return NextResponse.json(
        { error: "Invalid meeting data" },
        { status: 400 }
      );
    }

    if (
      meeting.meetingKind === "GROUP" &&
      (!meeting.attendeeCount || meeting.attendeeCount <= 0)
    ) {
      return NextResponse.json(
        { error: "Group meeting must have attendee count" },
        { status: 400 }
      );
    }
  }

  if (type === "SAMPLE_DISTRIBUTION") {
    if (
      !sample?.productId ||
      !VALID_PRODUCTS.includes(sample.productId)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing sample product" },
        { status: 400 }
      );
    }
  }

  if (type === "SALE") {
    if (
      !sale?.productId ||
      !VALID_PRODUCTS.includes(sale.productId) ||
      !sale?.customerName ||
      !sale?.customerCategory
    ) {
      return NextResponse.json(
        { error: "Invalid sale data" },
        { status: 400 }
      );
    }
  }

  /* ================= PHOTOS ================= */
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

  /* ================= CREATE ACTIVITY ================= */
  const activity = await Activity.create({
    distributor: user._id,
    day: day._id,
    type,

    geo: geoData,
    location: { lat, lng },
    address: geo?.displayName || "Unknown location",

    meeting: type.startsWith("MEETING") ? meeting : undefined,
    sample: type === "SAMPLE_DISTRIBUTION" ? sample : undefined,
    sale: type === "SALE" ? sale : undefined,

    odometerReading:
      Number(formData.get("odometer")) || undefined,
    notes: formData.get("notes") || "",
    photos,
  });

  return NextResponse.json(activity);
}
