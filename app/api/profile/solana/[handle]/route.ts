import { NextRequest } from "next/server";
import { resolveSNSHandle } from "../../sns/[handle]/utils";
import { PlatformType } from "../../../../../components/utils/platform";
import { regexSns, regexSolana } from "../../../../../components/utils/regexp";
import { ErrorMessages } from "../../../../../components/utils/types";
import {
  respondWithCache,
  errorHandle,
} from "../../../../../components/utils/utils";

const resolveSolanaRespond = async (handle: string) => {
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
  const { searchParams } = req.nextUrl;
  const inputName = searchParams.get("handle") || "";
  if (!regexSns.test(inputName) && !regexSolana.test(inputName))
    return errorHandle({
      identity: inputName,
      platform: PlatformType.solana,
      code: 404,
      message: ErrorMessages.invalidIdentity,
    });
  return resolveSolanaRespond(inputName);
}

export const runtime = "edge";
