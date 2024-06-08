import { NextRequest, NextResponse } from "next/server";
import { resolveUniversalRespondFromRelation } from "../../profile/[handle]/utils";
import { respondWithSVG } from "../svg/utils";
import {
  handleSearchPlatform,
  shouldPlatformFetch,
} from "../../../../components/utils/utils";
// import { profileAPIBaseURL } from "../../../../components/utils/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = searchParams.get("handle") || "";
  const platform = handleSearchPlatform(name);
  let avatarURL = "";
  if (shouldPlatformFetch(platform)) {
    const profiles = (await resolveUniversalRespondFromRelation({
      platform,
      handle: name,
      req,
      ns: true,
    })) as any;
    if (profiles?.length > 0) {
      const rawAvatarUrl = profiles?.find((x: any) => !!x.avatar)?.avatar;
      try {
        new URL(rawAvatarUrl);
        avatarURL = rawAvatarUrl;
      } catch (e) {
        return respondWithSVG(name, 240);
      }
      // if (rawAvatarUrl?.includes(".webp")) {
      //   avatarURL = `${profileAPIBaseURL}/avatar/process?url=${encodeURIComponent(
      //     rawAvatarUrl
      //   )}`;
      // }
      try {
        if (avatarURL) {
          return NextResponse.redirect(avatarURL);
        } else {
          return respondWithSVG(name, 240);
        }
      } catch (e) {
        return respondWithSVG(name, 240);
      }
    }
  }

  return respondWithSVG(name, 240);
}

export const runtime = "edge";
