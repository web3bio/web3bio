// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddress, isAddress } from "@ethersproject/address";

const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL);

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

type Data = {
  address: string | null;
  name: string | null;
  displayName: string;
  avatar: string | null;
  error?: string;
};

const resolveAddress = async (
  lowercaseAddress: string,
  res: NextApiResponse<Data>
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

    const avatar = name ? await provider.getAvatar(name) : null;

    res
      .status(200)
      .setHeader(
        "CDN-Cache-Control",
        `s-maxage=${60 * 60 * 24}, stale-while-revalidate`
      )
      .json({ address, name, displayName, avatar });
  } catch (error: any) {
    res.status(500).json({
      address,
      name: null,
      displayName,
      avatar: null,
      error: error.message,
    });
  }
};

const resolveName = async (name: string, res: NextApiResponse<Data>) => {
  const displayName = name;
  try {
    const [address, avatar] = await Promise.all([
      provider.resolveName(name),
      provider.getAvatar(name),
    ]);
    res
      .status(200)
      .setHeader(
        "CDN-Cache-Control",
        `s-maxage=${60 * 60 * 24}, stale-while-revalidate`
      )
      .json({ address, name, displayName, avatar });
  } catch (error: any) {
    res.status(500).json({
      address: null,
      name,
      displayName,
      avatar: null,
      error: error.message,
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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