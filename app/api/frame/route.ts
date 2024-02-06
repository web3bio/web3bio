import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio",
    { status: 302 }
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
