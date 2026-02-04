import { verifyToken } from "@/lib/jwt";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function getAuthUser(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    await connectDB();
    const user = await User.findById(decoded.userId);
    return user;
  } catch {
    return null;
  }
}
