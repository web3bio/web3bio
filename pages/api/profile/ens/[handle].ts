import type { NextApiRequest, NextApiResponse } from "next";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getAddress, isAddress } from "@ethersproject/address";
import {
  CoinType,
  HandleNotFoundResponseData,
  HandleResponseData,
  errorHandle,
} from "../../../../utils/api";
import {
  firstParam,
  getSocialMediaLink,
  resolveEipAssetURL,
  resolveHandle,
} from "../../../../utils/utils";
import { gql } from "@apollo/client";
import client from "../../../../utils/apollo";
import _ from "lodash";
import { PlatformType, platfomData } from "../../../../utils/platform";

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

const resolve = (from: string, to: string) => {
  const resolvedUrl = new URL(to, new URL(from, "resolve://"));
  if (resolvedUrl.protocol === "resolve:") {
    const { pathname, search, hash } = resolvedUrl;
    return `${pathname}${search}${hash}`;
  }
  return resolvedUrl.toString();
};

const resolveHandleFromURL = async (
  handle: string,
  res: NextApiResponse<HandleResponseData | HandleNotFoundResponseData>
) => {
  try {
    let address = "";
    let ensDomain = "";
    let avatar = null;
    if (isAddress(handle)) {
      address = getAddress(handle);
      ensDomain = (await provider.lookupAddress(address)) || null;
      avatar = (await provider.getAvatar(ensDomain)) || null;
    } else {
      [address, avatar] = await Promise.all([
        provider.resolveName(handle),
        provider.getAvatar(handle),
      ]);
      ensDomain = handle;
    }

    const gtext = await getENSTexts(ensDomain);
    const resolver = await provider.getResolver(ensDomain);
    if (!resolver) return errorHandle(handle, res);
    let LINKRES = {};
    let CRYPTORES = {
      eth: address,
      btc: null,
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
            _.findKey(platfomData, (o) => {
              return o.ensText.includes(recordText);
            }) || recordText;
          const handle = resolveHandle(
            (await resolver.getText(recordText)) || null
          );
          if (handle) {
            const resolvedKey =
              key === PlatformType.url ? PlatformType.website : key;
            _linkRes[resolvedKey] = {
              link: getSocialMediaLink(handle, resolvedKey),
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
          ![CoinType.btc, CoinType.eth].includes(Number(cur)) &&
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
        ...(await getCrypto()),
      };
    }
    const headerHandle = (await resolver.getText("header")) || null;
    const resJSON = {
      owner: address,
      identity: ensDomain,
      displayName: (await resolver.getText("name")) || ensDomain,
      avatar: await resolveEipAssetURL(avatar || null),
      email: (await resolver.getText("email")) || null,
      description: (await resolver.getText("description")) || null,
      location: (await resolver.getText("location")) || null,
      header: await resolveEipAssetURL(headerHandle || null),
      links: LINKRES,
      addresses: CRYPTORES,
    };

    res
      .status(200)
      .setHeader(
        "Cache-Control",
        `public, s-maxage=${60 * 60 * 24 * 7}, stale-while-revalidate=${
          60 * 30
        }`
      )
      .json(resJSON);
  } catch (error) {
    res.status(500).json({
      identity: isAddress(handle) ? handle : null,
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
