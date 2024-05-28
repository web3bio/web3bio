import {
  errorHandle,
  respondWithCache,
} from "@/utils/base";
import { PlatformType } from "@/utils/platform";
import { regexDotbit, regexEth } from "@/utils/regexp";
import { ErrorMessages } from "@/utils/types";
import { NextRequest } from "next/server";
import { resolveDotbitHandle } from "./utils";

const resolveDotbitRespond = async (handle: string) => {
  try {
    const json = await resolveDotbitHandle(handle);
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

export const runtime = "edge";