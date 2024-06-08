import { NextRequest } from "next/server";
import { resolveSNSHandle } from "./utils";
import { PlatformType } from "../../../../../components/utils/platform";
import { regexSns, regexSolana } from "../../../../../components/utils/regexp";
import { ErrorMessages } from "../../../../../components/utils/types";
import {
  respondWithCache,
  errorHandle,
} from "../../../../../components/utils/utils";

const resolveSNSRespond = async (handle: string) => {
  try {
    const json = await resolveSNSHandle(handle);
    return respondWithCache(JSON.stringify(json));
  } catch (e: any) {
    return errorHandle({
      identity: handle,
      platform: PlatformType.sns,
      code: e.cause || 500,
      message: e.message,
    });
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url as string);
  const inputName = searchParams.get("handle");
  if (
    (!regexSns.test(inputName!) && !regexSolana.test(inputName!)) ||
    !inputName
  )
    return errorHandle({
      identity: inputName,
      platform: PlatformType.sns,
      code: 404,
      message: ErrorMessages.invalidIdentity,
    });

  return resolveSNSRespond(inputName);
}
export const runtime = "edge";
export const preferredRegion = ["sfo1", "hnd1"];