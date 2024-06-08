import { NextRequest } from "next/server";
import { PlatformType } from "../../../../../components/utils/platform";
import {
  regexUnstoppableDomains,
  regexEth,
} from "../../../../../components/utils/regexp";
import { ErrorMessages } from "../../../../../components/utils/types";
import {
  respondWithCache,
  errorHandle,
} from "../../../../../components/utils/utils";
import { resolveUDResponse } from "../../../profile/unstoppabledomains/[handle]/utils";

const resolveUDHandleNS = async (handle: string) => {
  const { address, domain, metadata } = await resolveUDResponse(handle);
  return {
    address,
    identity: domain,
    platform: PlatformType.unstoppableDomains,
    displayName: metadata.profile.displayName || handle,
    avatar: metadata.profile.imagePath || null,
    description: metadata.profile.description || null,
  };
};

const resolveUDRespondNS = async (handle: string) => {
  try {
    const json = await resolveUDHandleNS(handle);
    return respondWithCache(JSON.stringify(json));
  } catch (e: any) {
    return errorHandle({
      identity: handle,
      platform: PlatformType.unstoppableDomains,
      code: e.cause || 500,
      message: e.message,
    });
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const inputName = searchParams.get("handle");
  const lowercaseName = inputName?.toLowerCase() || "";

  if (
    !regexUnstoppableDomains.test(lowercaseName) &&
    !regexEth.test(lowercaseName)
  )
    return errorHandle({
      identity: lowercaseName,
      platform: PlatformType.unstoppableDomains,
      code: 404,
      message: ErrorMessages.invalidIdentity,
    });
  return resolveUDRespondNS(lowercaseName);
}

export const runtime = "edge";
// export const preferredRegion = ["sfo1", "hnd1"];