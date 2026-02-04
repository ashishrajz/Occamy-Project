import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import User from "@/lib/models/User";

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const distributors = await User.find(
    { role: "DISTRIBUTOR" },
    { name: 1, phone: 1, avatar: 1 }
  );

  return NextResponse.json(distributors);
}
