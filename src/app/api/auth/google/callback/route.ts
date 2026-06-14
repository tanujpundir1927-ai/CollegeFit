import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("collegefit_oauth_state")?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const jwtSecret = process.env.JWT_SECRET;

  if (!code || !state || state !== expectedState || !clientId || !clientSecret || !jwtSecret) {
    return NextResponse.redirect(new URL("/account?error=oauth-failed", request.url));
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });
  if (!tokenResponse.ok) return NextResponse.redirect(new URL("/account?error=token-exchange", request.url));

  const tokens = await tokenResponse.json() as { access_token: string };
  const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userResponse.ok) return NextResponse.redirect(new URL("/account?error=user-profile", request.url));
  const user = await userResponse.json() as GoogleUser;

  const session = jwt.sign({ sub: user.sub, email: user.email, name: user.name, picture: user.picture, provider: "google" }, jwtSecret, { expiresIn: "7d", issuer: "collegefit-ai" });
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("collegefit_session", session, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/" });
  response.cookies.delete("collegefit_oauth_state");
  return response;
}
