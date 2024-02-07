import { NextRequest } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
const profileEndpoint =
  process.env.NEXT_PUBLIC_PROFILE_END_POINT || "https://api.web3.bio";

async function getResponse(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const defaultDomain = searchParams.get("domain");
  let profiles = new Array();

  if (!defaultDomain) return await respondWithRedirect(baseURL);
  const data = await req.json();
  const buttonId = data.untrustedData?.buttonIndex || 0;
  const domain = data.untrustedData?.url?.split("/")?.[3] || defaultDomain;
  try {
    profiles = await fetch(`${profileEndpoint}/profile/${domain}`).then((res) =>
      res.json()
    );
  } catch (e) {
    console.error(e);
    return await respondWithRedirect(baseURL);
  }

  const redirectURL =
    baseURL + "/" + !profiles?.length || buttonId === profiles?.length
      ? defaultDomain || ""
      : profiles[buttonId - 1].identity;

  return await respondWithRedirect(redirectURL);
}

export async function POST(req: NextRequest) {
  return getResponse(req);
}

const respondWithRedirect = (redirectURL) => {
  const internalRedirectURL = new URL(`${baseURL}/redirect`);
  internalRedirectURL.searchParams.set("redirectURL", redirectURL);
  return new Response(`<div>redirect to ${redirectURL}</div>`, {
    status: 302,
    headers: {
      Location: internalRedirectURL.toString(),
    },
  });
};

export const dynamic = "force-dynamic";
export const runtime = "edge";
