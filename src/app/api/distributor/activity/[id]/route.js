import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Activity from "@/lib/models/Activity";

export async function GET(req, context) {
  const user = await getAuthUser(req);

  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 🔑 IMPORTANT FIX
  const { id } = await context.params;

  const activity = await Activity.findOne({
    _id: id,
    distributor: user._id,
  });

  if (!activity) {
    return NextResponse.json(
      { error: "Activity not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(activity);
}
