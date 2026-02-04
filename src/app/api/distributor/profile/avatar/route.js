import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import User from "@/lib/models/User";

export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("photo");

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await cloudinary.uploader.upload(
    `data:${file.type};base64,${buffer.toString("base64")}`,
    {
      folder: "distributor-avatars",
      public_id: `user_${user._id}`,
      overwrite: true,
    }
  );

  user.avatar = upload.secure_url;
  await user.save();

  return NextResponse.json({ avatar: upload.secure_url });
}
