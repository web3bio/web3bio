// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddress, isAddress } from "@ethersproject/address";
import { resolveMediaURL } from "../../../../utils/utils";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT,
} from "../../../../components/apis/nftscan";
import { gql } from "@apollo/client";
import client from "../../../../utils/apollo";
import _ from "lodash";
import { GET_PROFILE_LENS } from "../../../../utils/lens";
import { HandleResponseData } from "../ens/types";

export const getLensProfile = async (handle: string) => {
  const fetchRes = await client.query({
    query: GET_PROFILE_LENS,
    variables: {
      handle,
    },
    context: {
      uri: process.env.NEXT_PUBLIC_LENS_GRAPHQL_SERVER,
    },
  });
  if (fetchRes) return fetchRes.data.profile;
  return null;
};

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

const resolveHandle = (handle: string) => {
  const prefix = "https://";
  if (handle && handle.startsWith(prefix)) {
    return handle.split(prefix)[1];
  }
  return handle;
};

const resolveHandleFromURL = async (
  handle: string,
  res: NextApiResponse<HandleResponseData>
) => {
  try {
    let address = "";
    let name = "";
    let avatar = null;
    if (isAddress(handle)) {
      address = getAddress(handle);
      name = (await provider.lookupAddress(address)) || null;
      avatar = (await provider.getAvatar(name)) || null;
    } else {
      [address, avatar] = await Promise.all([
        provider.resolveName(handle),
        provider.getAvatar(handle),
      ]);
      name = handle;
    }
    const res = await getLensProfile(handle);

    let LINKRES = {};
    let CRYPTORES = {
      eth: address,
      btc: null,
      ltc: null,
      doge: null,
    };

    const resJSON = {
      owner: address,
      identity: name,
      displayName: null,
      avatar: null,
      email: null,
      description: null,
      location: null,
      header: null,
      notice: null,
      keywords: null,
      url: null,
      links: LINKRES,
      addresses: CRYPTORES,
    };
    res
      .status(200)
      .setHeader(
        "CDN-Cache-Control",
        `s-maxage=${60 * 60 * 24}, stale-while-revalidate`
      )
      .json(resJSON);
  } catch (error: any) {
    res.status(500).json({
      owner: isAddress(handle) ? handle : null,
      identity: isAddress(handle) ? null : handle,
      displayName: isAddress(handle) ? null : handle,
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
  res: NextApiResponse<HandleResponseData>
) {
  const inputAddress = firstParam(req.query.handle);
  const lowercaseAddress = inputAddress.toLowerCase();

  if (inputAddress !== lowercaseAddress) {
    return res.redirect(307, resolve(req.url!, lowercaseAddress));
  }

  return resolveHandleFromURL(lowercaseAddress, res);
}
