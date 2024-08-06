import { NextRequest, NextResponse } from "next/server";
import { gitcoinPassportMapping } from "../../../../../components/utils/gitcoin";
import BigNumber from "bignumber.js";
import {
  isValidEthereumAddress,
  respondWithCache,
} from "../../../../../components/utils/utils";

const GITCOIN_PASSPORT_API_END_POINT = "https://api.scorer.gitcoin.co";

const fetchStamps = async (address) => {
  const res = await fetch(
    `${GITCOIN_PASSPORT_API_END_POINT}/registry/stamps/${address}?limit=1000&include_metadata=false`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_GITCOIN_API_KEY || "",
      },
    }
  );
  if (res.ok) {
    return (await res.json()).items
      .map((x) => x?.credential?.credentialSubject?.provider);
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
  if (!address || !isValidEthereumAddress(address)) {
    return emptyReturn();
  }
  const stamps = await fetchStamps(address);
  if (!stamps.length) return emptyReturn();
  const detailsArr = stamps
    .map((x) => gitcoinPassportMapping(x))
    .filter((x) => !!x);
  const score = detailsArr.reduce((pre, cur) => {
    pre = BigNumber(pre).plus(BigNumber(cur.weight)).toNumber();
    return pre;
  }, 0);

  return respondWithCache(
    JSON.stringify({
      score: score,
      updatedAt: new Date(),
      stamps: detailsArr,
    })
  );
}
export const runtime = "edge";
// export const preferredRegion = ["sfo1", "hnd1"];