import { NextRequest, NextResponse } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
const profileEndpoint =
  process.env.NEXT_PUBLIC_PROFILE_END_POINT || "https://api.web3.bio";

const defaultBack = () => NextResponse.redirect(baseURL, { status: 302 });

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams;
  const defaultDomain = searchParams.get("domain");
  let profiles = new Array();

  if (!defaultDomain) return defaultBack();
  const data = await req.json();
  const buttonId = data.untrustedData?.buttonIndex || 0;
  const domain = data.untrustedData?.url?.split("/")?.[3] || defaultDomain;
  //   try {
  //     profiles = await fetch(`${profileEndpoint}/profile/${domain}`).then((res) =>
  //       res.json()
  //     );
  //   } catch (e) {
  //     console.error(e);
  //     defaultBack();
  //   }

  const redirectURL =
    baseURL + "/" + !profiles?.length || buttonId === profiles?.length
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
