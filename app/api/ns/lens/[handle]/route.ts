import { NextRequest } from "next/server";
import { LensProtocolProfileCollectionAddress } from "../../../../../components/utils/lens";
import { PlatformType } from "../../../../../components/utils/platform";
import { regexLens, regexEth } from "../../../../../components/utils/regexp";
import { ErrorMessages } from "../../../../../components/utils/types";
import {
  resolveEipAssetURL,
  respondWithCache,
  errorHandle,
} from "../../../../../components/utils/utils";
import { resolveLensResponse } from "../../../profile/lens/[handle]/utils";

const resolveLensHandleNS = async (handle: string) => {
  const response = await resolveLensResponse(handle);
  if (!response) throw new Error(ErrorMessages.notFound, { cause: 404 });
  const avatarUri = response.metadata
    ? response.metadata?.picture?.raw?.uri ||
      response.metadata?.picture?.optimized?.uri
    : await resolveEipAssetURL(
        `eip155:137/erc721:${LensProtocolProfileCollectionAddress}/${parseInt(
          response.id?.slice(2),
          16
        )}`
      );
  const resJSON = {
    address: response.ownedBy?.address?.toLowerCase(),
    identity: response.handle.localName + ".lens",
    platform: PlatformType.lens,
    displayName:
      response.metadata?.displayName || response.handle.localName + ".lens",
    avatar: (await resolveEipAssetURL(avatarUri)) || null,
    description: response.metadata?.bio || null,
  };
  return resJSON;
};

const resolveLensRespond = async (handle: string) => {
  try {
    const json = await resolveLensHandleNS(handle);
    return respondWithCache(JSON.stringify(json));
  } catch (e: any) {
    return errorHandle({
      identity: handle,
      platform: PlatformType.lens,
      code: e.cause || 500,
      message: e.message,
    });
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const inputName = searchParams.get("handle");
  const lowercaseName = inputName?.toLowerCase() || "";

  if (!regexLens.test(lowercaseName) && !regexEth.test(lowercaseName))
    return errorHandle({
      identity: lowercaseName,
      platform: PlatformType.lens,
      code: 404,
      message: ErrorMessages.invalidIdentity,
    });
  return resolveLensRespond(lowercaseName);
}

export const runtime = "edge";
