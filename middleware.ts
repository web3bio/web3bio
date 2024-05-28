import { NextResponse } from "next/server";
import { regexSolana } from "./components/utils/regexp";

export const config = {
  matcher: ["/api/ns/:path*", "/api/profile/:path*"],
};

export function middleware(req: {
  nextUrl: { pathname: string; clone: () => URL };
}) {
  const identity = req.nextUrl.pathname.split("/").pop() || "";
  if (
    req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase() &&
    !regexSolana.test(identity)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = url.pathname.toLowerCase();
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
