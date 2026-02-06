export async function sendOtpSms({ phone, otp }) {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "v3", // ✅ TRANSACTIONAL (NOT OTP)
        sender_id: "TXTIND",
        message: `Your AgriTrack login OTP is ${otp}. Valid for 5 minutes.`,
        numbers: cleanPhone,
      }),
    });
  
    const data = await res.json();
    console.log("FAST2SMS RESPONSE:", data);
  
    if (!data.return) {
      throw new Error(data.message || "SMS failed");
    }
  
    return true;
  }
  