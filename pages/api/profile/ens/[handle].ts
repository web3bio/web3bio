// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddress, isAddress } from "@ethersproject/address";
import { CoinType, ENSResponseData } from "./types";
import { getSocialMediaLink } from "./utils";
import { resolveMediaURL, SocialPlatform } from "../../../../utils/utils";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT,
} from "../../../../components/apis/nftscan";

const provider = new StaticJsonRpcProvider(
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL
);

const firstParam = (param: string | string[]) => {
  return Array.isArray(param) ? param[0] : param;
};

const resolve = (from: string, to: string) => {
  const resolvedUrl = new URL(to, new URL(from, "resolve://"));
  if (resolvedUrl.protocol === "resolve:") {
    const { pathname, search, hash } = resolvedUrl;
    return `${pathname}${search}${hash}`;
  }
  return resolvedUrl.toString();
};

const resolveAddress = async (
  lowercaseAddress: string,
  res: NextApiResponse<ENSResponseData>
) => {
  const address = getAddress(lowercaseAddress);
  let displayName = address.replace(
    /^(0x[0-9A-F]{3})[0-9A-F]+([0-9A-F]{4})$/i,
    "$1…$2"
  );

  try {
    const name = await provider.lookupAddress(address);
    if (name) {
      displayName = name;
    }

    const avatar = name
      ? resolveMediaURL((await provider.getAvatar(name)) || null)
      : null;
    const resolver = await provider.getResolver(name);
    const twitterHandle =
      (await resolver.getText("com.twitter")) ||
      (await resolver.getText("vnd.twitter")) ||
      null;
    const githubHandle =
      (await resolver.getText("com.github")) ||
      (await resolver.getText("vnd.github")) ||
      null;
    const tgHandle = (await resolver.getText("org.telegram")) || null;
    const discordHandle = (await resolver.getText("com.discord")) || null;
    const redditHandle = (await resolver.getText("com.reddit")) || null;
    const headerHandle = (await resolver.getText("header")) || null;
    const urlHandle = (await resolver.getText("url")) || null;
    res
      .status(200)
      .setHeader(
        "CDN-Cache-Control",
        `s-maxage=${60 * 60 * 24}, stale-while-revalidate`
      )
      .json({
        owner: address,
        identity: name,
        displayName: name,
        avatar,
        email: (await resolver.getText("email")) || null,
        description: (await resolver.getText("description")) || null,
        location: (await resolver.getText("location")) || null,
        header: await resolveEipAssetURL(headerHandle || null),
        notice: (await resolver.getText("notice")) || null,
        keywords: (await resolver.getText("keywords")) || null,
        links: {
          twitter: {
            link: getSocialMediaLink(twitterHandle, SocialPlatform.twitter),
            handle: twitterHandle,
          },
          github: {
            link: getSocialMediaLink(githubHandle, SocialPlatform.github),
            handle: githubHandle,
          },
          telegram: {
            link: getSocialMediaLink(tgHandle, SocialPlatform.telegram),
            handle: tgHandle,
          },
          discord: {
            link: getSocialMediaLink(discordHandle, SocialPlatform.discord),
            handle: discordHandle,
          },
          reddit: {
            link: getSocialMediaLink(redditHandle, SocialPlatform.reddit),
            handle: redditHandle,
          },
          url: {
            link: getSocialMediaLink(urlHandle, SocialPlatform.url),
            handle: urlHandle,
          },
        },
        addresses: {
          eth: address,
          btc: await resolver.getAddress(CoinType.bitcoin),
          ltc: await resolver.getAddress(CoinType.litecoin),
          doge: await resolver.getAddress(CoinType.dogecoin),
        },
      });
  } catch (error: any) {
    res.status(500).json({
      owner: address,
      identity: null,
      displayName: null,
      avatar: null,
      email: null,
      description: null,
      location: null,
      header: null,
      notice: null,
      keywords: null,
      links: {},
      addresses: {},
      error: error.message,
    });
  }
};

const resolveEipAssetURL = async (asset) => {
  if (!asset) return null;
  const eipPrefix = "eip155:1/erc721:";
  if (asset.startsWith(eipPrefix)) {
    const arr = asset.split(eipPrefix)[1].split("/");
    const url =
      NFTSCAN_BASE_API_ENDPOINT +
      `assets/${arr[0]}/${arr[1]}?show_attribute=false`;
    const res = await NFTSCANFetcher(url);
    if (res && res.data) {
      return resolveMediaURL(res.data.image_uri || res.data.content_uri);
    }
  }
  return resolveMediaURL(asset);
};
const resolveName = async (
  name: string,
  res: NextApiResponse<ENSResponseData>
) => {
  try {
    const [address, avatar] = await Promise.all([
      provider.resolveName(name),
      provider.getAvatar(name),
    ]);
    const resolver = await provider.getResolver(name);
    const twitterHandle =
      (await resolver.getText("com.twitter")) ||
      (await resolver.getText("vnd.twitter")) ||
      null;
    const githubHandle =
      (await resolver.getText("com.github")) ||
      (await resolver.getText("vnd.github")) ||
      null;
    const tgHandle = (await resolver.getText("org.telegram")) || null;
    const discordHandle = (await resolver.getText("com.discord")) || null;
    const redditHandle = (await resolver.getText("com.reddit")) || null;
    const headerHandle = (await resolver.getText("header")) || null;
    const urlHandle = (await resolver.getText("url")) || null;
    res
      .status(200)
      .setHeader(
        "CDN-Cache-Control",
        `s-maxage=${60 * 60 * 24}, stale-while-revalidate`
      )
      .json({
        owner: address,
        identity: name,
        displayName: name,
        avatar: await resolveEipAssetURL(avatar || null),
        email: (await resolver.getText("email")) || null,
        description: (await resolver.getText("description")) || null,
        location: (await resolver.getText("location")) || null,
        header: await resolveEipAssetURL(headerHandle || null),
        notice: (await resolver.getText("notice")) || null,
        keywords: (await resolver.getText("keywords")) || null,
        links: {
          twitter: {
            link: getSocialMediaLink(twitterHandle, SocialPlatform.twitter),
            handle: twitterHandle,
          },
          github: {
            link: getSocialMediaLink(githubHandle, SocialPlatform.github),
            handle: githubHandle,
          },
          telegram: {
            link: getSocialMediaLink(tgHandle, SocialPlatform.telegram),
            handle: tgHandle,
          },
          discord: {
            link: getSocialMediaLink(discordHandle, SocialPlatform.discord),
            handle: discordHandle,
          },
          reddit: {
            link: getSocialMediaLink(redditHandle, SocialPlatform.reddit),
            handle: redditHandle,
          },
          url: {
            link: getSocialMediaLink(urlHandle, SocialPlatform.url),
            handle: urlHandle,
          },
        },
        addresses: {
          eth: address,
          btc: await resolver.getAddress(CoinType.bitcoin),
          ltc: await resolver.getAddress(CoinType.litecoin),
          doge: await resolver.getAddress(CoinType.dogecoin),
        },
      });
  } catch (error: any) {
    res.status(500).json({
      owner: null,
      identity: name,
      displayName: name,
      avatar: null,
      email: null,
      description: null,
      location: null,
      header: null,
      notice: null,
      keywords: null,
      links: {},
      addresses: {},
      error: error.message,
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ENSResponseData>
) {
  const inputAddress = firstParam(req.query.handle);
  const lowercaseAddress = inputAddress.toLowerCase();

  if (inputAddress !== lowercaseAddress) {
    return res.redirect(307, resolve(req.url!, lowercaseAddress));
  }

  return isAddress(lowercaseAddress)
    ? resolveAddress(lowercaseAddress, res)
    : resolveName(lowercaseAddress, res);
}
