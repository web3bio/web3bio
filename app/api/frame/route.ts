import { NextRequest, NextResponse } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams;
  const defaultDomain = searchParams.get("domain");

  if (!defaultDomain) return NextResponse.redirect(baseURL, { status: 302 });
  
  const data = await req.json();
  const buttonId = data.untrustedData.buttonIndex;
  const domain = data.untrustedData.url.split("/")[3];
  const profiles = await fetch(
    `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${domain}`
  ).then((res) => res.json());
  const redirectURL =
    baseURL + "/" + !profiles || buttonId === profiles?.length
      ? defaultDomain || ""
      : profiles[buttonId - 1].identity;
  const headers = new Headers();
  headers.set("Location", redirectURL);
  return NextResponse.redirect(redirectURL, { headers, status: 302 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
