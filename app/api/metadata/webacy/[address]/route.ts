import { NextRequest, NextResponse } from "next/server";
import { regexSolana } from "@/components/utils/regexp";
import { respondWithCache } from "@/components/utils/utils";
import { WEBACY_API_ENDPOINT } from "@/components/utils/api";
interface WebacyResponse {
  score: number;
  updatedAt: Date;
  stamps: any[];
}

async function fetchWebacy(address: string): Promise<WebacyResponse> {
  const chain = regexSolana.test(address) ? "sol" : "eth";
  const url = new URL(`${WEBACY_API_ENDPOINT}/addresses/${address}`);
  url.searchParams.append("chain", chain);

  const res = await fetch(url.toString(), {
    headers: { "x-api-key": process.env.NEXT_PUBLIC_WEBACY_API_KEY || "" },
  });

  if (!res.ok) {
    console.error(`Failed to fetch Webacy data: ${res.statusText}`);
    return createEmptyResponse();
  }

  return await res.json();
}

function createEmptyResponse(): WebacyResponse {
  return {
    score: 0,
    updatedAt: new Date(),
    stamps: [],
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const address = req.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json(createEmptyResponse());
  }

  try {
    const scores = await fetchWebacy(address);
    return respondWithCache(JSON.stringify(scores));
  } catch (error) {
    console.error("Error fetching Webacy data:", error);
    return NextResponse.json(createEmptyResponse());
  }
}

export const runtime = "edge";
