import { NextRequest } from "next/server";
import { PlatformType } from "../../../../../components/utils/platform";
import { regexDotbit, regexEth } from "../../../../../components/utils/regexp";
import { ErrorMessages } from "../../../../../components/utils/types";
import {
  errorHandle,
  respondWithCache,
} from "../../../../../components/utils/utils";
import { resolveDotbitResponse } from "../../../profile/dotbit/[handle]/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const inputName = searchParams.get("handle");
  const lowercaseName = inputName?.toLowerCase() || "";

  if (!regexDotbit.test(lowercaseName) && !regexEth.test(lowercaseName))
    return errorHandle({
      identity: lowercaseName,
      platform: PlatformType.dotbit,
      code: 404,
      message: ErrorMessages.invalidIdentity,
    });
  return resolveDotbitRespond(lowercaseName);
}

const resolveDotbitHandleNS = async (handle: string) => {
  const { address, domain, recordsMap } = await resolveDotbitResponse(handle);
  return {
    address,
    identity: domain,
    platform: PlatformType.dotbit,
    displayName: domain || null,
    avatar: recordsMap.get("profile.avatar")?.value || null,
    description: recordsMap.get("profile.description")?.value || null,
  };
};

const resolveDotbitRespond = async (handle: string) => {
  try {
    const json = await resolveDotbitHandleNS(handle);
    return respondWithCache(JSON.stringify(json));
  } catch (e: any) {
    return errorHandle({
      identity: handle,
      platform: PlatformType.dotbit,
      code: e.cause || 500,
      message: e.message,
    });
  }
};

export const runtime = "edge";
export const preferredRegion = ["sfo1", "hnd1"];