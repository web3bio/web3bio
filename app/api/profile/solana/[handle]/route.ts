import { errorHandle, respondWithCache } from "@/utils/base";
import { PlatformType } from "@/utils/platform";
import { regexSns, regexSolana } from "@/utils/regexp";
import { ErrorMessages } from "@/utils/types";
import { NextRequest } from "next/server";
import { resolveSNSHandle } from "../../sns/[handle]/utils";

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
