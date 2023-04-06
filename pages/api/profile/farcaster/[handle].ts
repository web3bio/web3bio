import type { NextApiRequest, NextApiResponse } from "next";
import _ from "underscore";
import { HandleResponseData } from "../../../../utils/api";
import { PlatformType } from "../../../../utils/type";
import {
  firstParam,
  getSocialMediaLink,
  resolveHandle,
} from "../../../../utils/utils";

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
    if(!response || !response.length) throw new Error('not found')
    const _res = response[0].body;
    const resolvedHandle = resolveHandle(_res.username);
    const LINKRES = {
      [PlatformType.farcaster]: {
        link: getSocialMediaLink(resolvedHandle, PlatformType.farcaster),
        handle: resolvedHandle,
      },
    };
    const resJSON = {
      owner: response[0].connectedAddress || _res.address,
      identity: _res.username || _res.displayName,
      displayName: _res.displayName || resolvedHandle,
      avatar: _res.avatarUrl,
      email: null,
      description: _res.bio,
      location: null,
      header: null,
      links: LINKRES,
      addresses: {
        eth: response[0].connectedAddress || _res.address,
      },
    };
    res
      .status(200)
      .setHeader(
        "CDN-Cache-Control",
        `s-maxage=${60 * 60 * 8}, stale-while-revalidate=${60 * 10}`
      )
      .json(resJSON);
  } catch (e: any) {
    res.status(500).json({
      owner: null,
      identity: handle,
      displayName: null,
      avatar: null,
      email: null,
      description: null,
      location: null,
      header: null,
      links: {
        [PlatformType.farcaster]: {
          link: getSocialMediaLink(handle, PlatformType.farcaster),
          handle: handle,
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
  res: NextApiResponse<HandleResponseData>
) {
  const reqValue = firstParam(req.query.handle);
  if (!reqValue) {
    return res.redirect(307, resolve(req.url!, reqValue));
  }
  return resolveFarcasterHandle(reqValue, res);
}
