import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if(!req.headers.get('referer')) return res
  if (req.nextUrl.pathname.startsWith("/sujiyan.eth")) {
    return NextResponse.rewrite(new URL("/profile/sujiyan.eth", req.url));
  }
  return res;
}
