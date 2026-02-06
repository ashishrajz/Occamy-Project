import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Otp from "@/lib/models/Otp";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { sendOtpSms } from "@/lib/sms";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    await connectDB();
    const { phone, role } = await req.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    // Optional: validate role exists
    if (role) {
      const existingUser = await User.findOne({ phone });
      if (existingUser && existingUser.role !== role) {
        return NextResponse.json({ error: "Role mismatch" }, { status: 403 });
      }
    }

    // Rate-limit: delete old OTPs
    await Otp.deleteMany({
      phone,
      expiresAt: { $lt: new Date() },
    });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.create({
      phone,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // TODO: SEND OTP VIA SMS PROVIDER
    
// send OTP
await sendOtpSms({
    phone,
    otp,
  });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("REQUEST OTP ERROR:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
