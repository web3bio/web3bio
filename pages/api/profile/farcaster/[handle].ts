import type { NextApiRequest, NextApiResponse } from "next";
import _ from "underscore";
import { HandleResponseData } from "../../../../utils/api";
import { SocialPlatformMapping } from "../../../../utils/platform";
import { firstParam, resolveHandle } from "../../../../utils/utils";

const originBase = "https://searchcaster.xyz/api/";

const FetchFromOrigin = async (value: string) => {
  if (!value) return;
  const res = await fetch(originBase + `profiles?username=${value}`).then(
    (res) => res.json()
  );
  return res;
};

const resolveFarcasterHandle = async (
  handle: string,
  res: NextApiResponse<HandleResponseData>
) => {
  try {
    const response = await FetchFromOrigin(handle);
    if (response && response.body) {
      const _res = response.body;
      const resolvedHandle = resolveHandle(_res.username);
      const LINKRES = {
        [SocialPlatformMapping.farcaster.key]: {
          link: "https://warpcast.com/" + resolvedHandle,
          handle: resolvedHandle,
        },
      };
      const resJSON = {
        owner: _res.username || _res.displayName,
        identity: _res.username || _res.displayName,
        displayName: response.name || resolvedHandle,
        avatar: _res.avatarUrl,
        email: null,
        description: response.bio,
        location: null,
        header: null,
        notice: null,
        keywords: null,
        links: LINKRES,
        addresses: {
          eth: response.connectedAddress || _res.address,
        },
      };
      res
        .status(200)
        .setHeader(
          "CDN-Cache-Control",
          `s-maxage=${60 * 60 * 24}, stale-while-revalidate`
        )
        .json(resJSON);
    }
  } catch (e: any) {
    res.status(500).json({
      owner: handle,
      identity: handle,
      displayName: handle,
      avatar: null,
      email: null,
      description: null,
      location: null,
      header: null,
      notice: null,
      keywords: null,
      links: {
        twitter: {
          link: "https://twitter.com/" + handle,
          handle,
        },
      },
      addresses: null,
      error: e.message,
    });
  }
};
const resolve = (from: string, to: string) => {
  const resolvedUrl = new URL(to, new URL(from, "resolve://"));
  if (resolvedUrl.protocol === "resolve:") {
    const { pathname, search, hash } = resolvedUrl;
    return `${pathname}${search}${hash}`;
  }
  return resolvedUrl.toString();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqValue = firstParam(req.query.handle);
  if (!reqValue) {
    return res.redirect(307, resolve(req.url!, reqValue));
  }
  return resolveFarcasterHandle(reqValue, res);
}
