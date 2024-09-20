import { NextRequest, NextResponse } from "next/server";
import { respondWithCache } from "@/components/utils/utils";
import { BANKLESS_API_ENDPOINT } from "@/components/utils/api";

async function fetchBankless(address: string) {
  const url = new URL(`${BANKLESS_API_ENDPOINT}/claimables/${address}`);
  const res = await fetch(url.toString(), {
    headers: {
      "x-bankless-token": process.env.NEXT_PUBLIC_BANKLESS_API_KEY || "",
    },
  });

  if (!res.ok) {
    console.error(`Failed to fetch bankless data`);
    return createEmptyResponse();
  }

  return await res.json();
}

function createEmptyResponse() {
  return {
    error: "invalid address",
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const address = req.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json(createEmptyResponse());
  }

  try {
    const res = await fetchBankless(address);
    return respondWithCache(JSON.stringify(res));
  } catch (error) {
    console.error("Error fetching bankless data:", error);
    return NextResponse.json(createEmptyResponse());
  }
}

export const runtime = "edge";
