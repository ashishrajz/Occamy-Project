// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import User from "@/lib/models/User";


export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, email, role, language, region } = body;

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    // Simple identifier logic
    const query = phone ? { phone } : { email };

    let user = await User.findOne(query);

    if (!user) {
      user = await User.create({
        name: name || "User",
        phone,
        email,
        role,
        language: language || "en",
        region,
      });
    }

    // Role mismatch protection
    if (user.role !== role) {
      return NextResponse.json(
        { error: "Role mismatch" },
        { status: 403 }
      );
    }

    const token = signToken({
      userId: user._id,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        language: user.language,
      },
    });
    
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    
    return response;
    

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
