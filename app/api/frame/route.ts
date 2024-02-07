import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const headers = new Headers();
  // todo: for test
  const baseURL =
    "https://web3bio-git-chore-fcframe-initial-expand-web3bio.vercel.app";
  headers.set("Location", baseURL);
  return NextResponse.redirect(baseURL, { headers, status: 302 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
