// src/app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  const user = await getAuthUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user._id,
    name: user.name,
    role: user.role,
    language: user.language,
    region: user.region,
  });
}
