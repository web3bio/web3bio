import { NextRequest } from "next/server";
import { resolveUniversalHandle } from "../../profile/[handle]/utils";
import { ErrorMessages } from "../../../../components/utils/types";
import {
  handleSearchPlatform,
  shouldPlatformFetch,
  errorHandle,
} from "../../../../components/utils/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const inputName = searchParams.get("handle")?.toLowerCase() || "";
  const platform = handleSearchPlatform(inputName);
  if (!inputName || !platform || !shouldPlatformFetch(platform)) {
    return errorHandle({
      identity: inputName,
      code: 404,
      platform: null,
      message: ErrorMessages.invalidIdentity,
    });
  }
  return await resolveUniversalHandle(inputName, req, platform, true);
}
export const runtime = "edge";
export const preferredRegion = ["hnd1", "sfo1"];