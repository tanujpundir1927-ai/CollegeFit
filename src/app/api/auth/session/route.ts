import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("collegefit_session")?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return Response.json({ user: null });
  try {
    const user = jwt.verify(token, secret, { issuer: "collegefit-ai" });
    return Response.json({ user });
  } catch {
    return Response.json({ user: null }, { status: 401 });
  }
}
