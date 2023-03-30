// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddress, isAddress } from "@ethersproject/address";
import { CoinType, HandleResponseData } from "./types";
import { getSocialMediaLink } from "./utils";
import { resolveMediaURL } from "../../../../utils/utils";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT,
} from "../../../../components/apis/nftscan";
import { gql } from "@apollo/client";
import client from "../../../../utils/apollo";
import _ from "lodash";
import { SocialPlatformMapping } from "../../../../utils/platform";
import { PlatformType } from "../../../../utils/type";

const ensRecordsDefaultOrShouldSkipText = [
  "name",
  "email",
  "snapshot",
  "avatar",
  "header",
  "description",
  "eth.ens.delegate",
  "notice",
  "keywords",
  "location",
  "url",
];

const getENSRecordsQuery = gql`
  query Profile($name: String) {
    domains(where: { name: $name }) {
      id
      name
      resolver {
        texts
        coinTypes
      }
    }
  }
`;

const ensSubGraphBase =
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

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

    const gtext = await getENSTexts(name);
    const resolver = await provider.getResolver(name);
    let LINKRES = {};
    let CRYPTORES = {
      eth: address,
      btc: null,
      ltc: null,
      doge: null,
    };
    if (gtext && gtext[0].resolver.texts) {
      const linksRecords = gtext[0].resolver.texts;
      const linksToFetch = linksRecords.reduce((pre, cur) => {
        if (!ensRecordsDefaultOrShouldSkipText.includes(cur)) pre.push(cur);
        return pre;
      }, []);

      const getLink = async () => {
        const _linkRes = {};
        for (let i = 0; i < linksToFetch.length; i++) {
          const recordText = linksToFetch[i];
          const key =
            _.findKey(SocialPlatformMapping, (o) => {
              return o.ensText.includes(recordText);
            }) || recordText;
          const handle = resolveHandle(
            (await resolver.getText(recordText)) || null
          );
          if (handle) {
            _linkRes[key] = {
              link: getSocialMediaLink(handle, key),
              handle: handle,
            };
          }
        }
        return _linkRes;
      };
      LINKRES = await getLink();
    }
    if (gtext && gtext[0].resolver.coinTypes) {
      const cryptoRecrods = gtext[0].resolver.coinTypes;
      const cryptoRecordsToFetch = cryptoRecrods.reduce((pre, cur) => {
        if (
          ![CoinType.btc, CoinType.eth, CoinType.ltc, CoinType.doge].includes(
            Number(cur)
          ) &&
          _.findKey(CoinType, (o) => o == cur)
        )
          pre.push(cur);
        return pre;
      }, []);
      const getCrypto = async () => {
        const _cryptoRes = {};
        for (let i = 0; i < cryptoRecordsToFetch.length; i++) {
          const _coinType = cryptoRecordsToFetch[i];
          const key = _.findKey(CoinType, (o) => {
            return o == _coinType;
          });

          _cryptoRes[key] = (await resolver.getAddress(_coinType)) || null;
        }
        return _cryptoRes;
      };
      CRYPTORES = {
        eth: address,
        btc: await resolver.getAddress(CoinType.btc),
        ltc: await resolver.getAddress(CoinType.ltc),
        doge: await resolver.getAddress(CoinType.doge),
        ...(await getCrypto()),
      };
    }
    const headerHandle = (await resolver.getText("header")) || null;

    const resJSON = {
      owner: address,
      identity: name,
      displayName: (await resolver.getText("name")) || name,
      avatar: await resolveEipAssetURL(avatar || null),
      email: (await resolver.getText("email")) || null,
      description: (await resolver.getText("description")) || null,
      location: (await resolver.getText("location")) || null,
      header: await resolveEipAssetURL(headerHandle || null),
      notice: (await resolver.getText("notice")) || null,
      keywords: (await resolver.getText("keywords")) || null,
      url: getSocialMediaLink(
        (await resolver.getText("url")) || null,
        PlatformType.url
      ),
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

export const getENSTexts = async (name: string) => {
  const fetchRes = await client.query({
    query: getENSRecordsQuery,
    variables: {
      name,
    },
    context: {
      uri: ensSubGraphBase,
    },
  });
  if (fetchRes) return fetchRes.data.domains;
  return null;
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
