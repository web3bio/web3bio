import { NextRequest } from "next/server";
import { resolveENSHandle } from "./utils";
import { PlatformType } from "../../../../../components/utils/platform";
import { errorHandle, respondWithCache } from "../../../../../components/utils/utils";
import { regexEns, regexEth } from "../../../../../components/utils/regexp";
import { ErrorMessages } from "../../../../../components/utils/types";

const resolveENSRespond = async (handle: string) => {
  try {
    const json = await resolveENSHandle(handle);
    return respondWithCache(JSON.stringify(json));
  } catch (e: any) {
    return errorHandle({
      identity: handle,
      platform: PlatformType.ens,
      code: e.cause || 500,
      message: e.message,
    });
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const inputName = searchParams.get("handle") || "";
  const lowercaseName = inputName?.toLowerCase();

  if (!regexEns.test(lowercaseName) && !regexEth.test(lowercaseName))
    return errorHandle({
      identity: lowercaseName,
      platform: PlatformType.ens,
      code: 404,
      message: ErrorMessages.invalidIdentity,
    });
  return resolveENSRespond(lowercaseName);
}

export const runtime = "edge";
export const preferredRegion = ["sfo1", "hnd1"];