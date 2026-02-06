import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Otp from "@/lib/models/Otp";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { phone, otp, role, language = "en" } = await req.json();

    const record = await Otp.findOne({ phone, used: false }).sort({ createdAt: -1 });

    if (!record) {
      return NextResponse.json({ error: "OTP not found" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (record.attempts >= 3) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }

    const isValid = await bcrypt.compare(otp, record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    record.used = true;
    await record.save();

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        role,
        language,
        name: "User",
      });
    }

    const token = signToken({
      userId: user._id,
      role: user.role,
    });

    const res = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set("NEXT_LOCALE", user.language || "en", {
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return NextResponse.json({ error: "OTP verification failed" }, { status: 500 });
  }
}
