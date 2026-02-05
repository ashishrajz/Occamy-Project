import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";
import mongoose from "mongoose";

export async function GET(req, context) {
  const admin = await getAuthUser(req);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ THIS IS THE FIX
  const params = await context.params;
  const id = params?.id;

  // Defensive guard
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid activity ID" },
      { status: 400 }
    );
  }

  const activity = await Activity.findById(id)
    .populate("distributor", "name");

  if (!activity) {
    return NextResponse.json(
      { error: "Activity not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(activity);
}
