import { NextRequest } from "next/server";
import { resolveENSRespondNS } from "./utils";
import { PlatformType } from "../../../../../components/utils/platform";
import { regexEns, regexEth } from "../../../../../components/utils/regexp";
import { ErrorMessages } from "../../../../../components/utils/types";
import { errorHandle } from "../../../../../components/utils/utils";

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
  return resolveENSRespondNS(lowercaseName);
}

export const runtime = "edge";
export const preferredRegion = ["hnd1", "sfo1"];