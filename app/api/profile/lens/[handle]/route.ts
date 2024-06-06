import { NextRequest } from "next/server";
import { errorHandle } from "../../../../../components/utils/utils";

import { ErrorMessages } from "../../../../../components/utils/types";
import { PlatformType } from "../../../../../components/utils/platform";
import { regexLens, regexEth } from "../../../../../components/utils/regexp";
import { resolveLensRespond } from "./utils";

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
export const preferredRegion = ["hnd1", "sfo1"];