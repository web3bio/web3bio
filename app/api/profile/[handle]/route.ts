import { NextRequest } from "next/server";
import { resolveUniversalHandle } from "./utils";
import {
  errorHandle,
  handleSearchPlatform,
  shouldPlatformFetch,
} from "../../../../components/utils/utils";
import { ErrorMessages } from "../../../../components/utils/types";
import { PlatformType } from "../../../../components/utils/platform";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const inputName = searchParams.get("handle")?.toLowerCase() || "";
  const platform = handleSearchPlatform(inputName);
  if (
    !inputName ||
    !platform ||
    !shouldPlatformFetch(platform) ||
    platform === PlatformType.dotbit
  ) {
    return errorHandle({
      identity: inputName,
      code: 404,
      platform: null,
      message: ErrorMessages.invalidIdentity,
    });
  }
  return await resolveUniversalHandle(inputName, req, platform, false);
}

export const runtime = "edge";
