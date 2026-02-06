"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OtpLogin() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestOtp() {
    setLoading(true);
    await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, role: "DISTRIBUTOR" }),
    });
    setLoading(false);
    setStep(2);
  }

  async function verifyOtp() {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, role: "DISTRIBUTOR" }),
    });

    if (res.ok) router.push("/distributor");
    else alert("Invalid OTP");

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-xl space-y-6">
        <h1 className="text-2xl font-black text-center">Login with OTP</h1>

        {step === 1 && (
          <>
            <input
              placeholder="Phone number"
              className="w-full p-4 rounded-xl border font-bold"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              className="w-full p-4 rounded-xl border font-bold tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-black"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
