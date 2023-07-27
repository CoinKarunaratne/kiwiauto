import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("user-token")?.value;

  const verifiedToken =
    token && (await verifyAuth(token).catch((err: Error) => console.log(err)));

  const { pathname } = new URL(req.url);

  if (pathname === "/" && !verifiedToken) {
    return;
  }

  if (pathname === "/" && verifiedToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // if (!verifiedToken) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
}

export const config = {
  matcher: [
    "/",
    "/add",
    "/dashboard",
    "/customers",
    "/customers/:path*",
    "/sales",
    "/services",
    "/settings",
  ],
};
