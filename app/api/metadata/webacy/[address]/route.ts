import { NextRequest, NextResponse } from "next/server";
import { regexSolana } from "../../../../../components/utils/regexp";
import { respondWithCache } from "../../../../../components/utils/utils";

const WEBACY_API_ENDPOINT = "https://api.webacy.com";
const fetchWebacy = async (address) => {
  const res = await fetch(
    `${WEBACY_API_ENDPOINT}/addresses/${address}?chain=${
      regexSolana.test(address) ? "sol" : "eth"
    }`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_WEBACY_API_KEY || "",
      },
    }
  );
  if (res.ok) {
    return await res.json();
  }
  return [];
};

const emptyReturn = () =>
  NextResponse.json({
    score: 0,
    updatedAt: new Date(),
    stamps: [],
  });

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const address = searchParams.get("address");
  if (!address) {
    return emptyReturn();
  }
  const scores = await fetchWebacy(address);
  return respondWithCache(JSON.stringify(scores));
}
export const runtime = "edge";
// export const preferredRegion = ["sfo1", "hnd1"];
