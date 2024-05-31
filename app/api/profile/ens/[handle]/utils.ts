import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import {
  decodeContenthash,
  formatText,
  getSocialMediaLink,
  isValidEthereumAddress,
  resolveEipAssetURL,
  resolveHandle,
} from "../../../../../components/utils/utils";
import { ErrorMessages } from "../../../../../components/utils/types";
import {
  PlatformData,
  PlatformType,
} from "../../../../../components/utils/platform";
import { regexEns } from "../../../../../components/utils/regexp";
const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
}) as any;
const ensSubGraphBaseURL =
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

const commonQueryOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

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
  "banner",
];

const getENSRecordsQuery = `
    query Profile($name: String) {
      domains(where: { name: $name }) {
        resolver {
          texts
          coinTypes
          contentHash
        }
      }
    }
  `;

export const resolveENSTextValue = async (name: string, text: string) => {
  return await client.getEnsText({
    name: name,
    key: text,
  });
};

const getHeaderTextValue = async (texts: string[], domain: string) => {
  if (!texts?.length) return null;
  if (texts.includes("header")) {
    return resolveENSTextValue(domain, "header");
  }
  if (texts.includes("banner")) {
    return resolveENSTextValue(domain, "banner");
  }
  return null;
};

export const resolveENSResponse = async (handle: string) => {
  let address = "";
  let ensDomain = "";
  let resolver = null as any;
  if (isValidEthereumAddress(handle)) {
    if (!isValidEthereumAddress(handle))
      throw new Error(ErrorMessages.invalidAddr, { cause: 404 });
    address = handle.toLowerCase();
    ensDomain =
      (await client.getEnsName({
        address,
      })) || "";

    resolver = (await getENSProfile(ensDomain))?.[0];

    if (!ensDomain) {
      return {
        address,
        earlyReturnJSON: {
          address: address,
          identity: address,
          platform: PlatformType.ethereum,
          displayName: formatText(address),
          avatar: null,
          description: null,
          email: null,
          location: null,
          header: null,
          contenthash: null,
          links: {},
        },
      };
    }
  } else {
    if (!regexEns.test(handle))
      throw Error(ErrorMessages.invalidIdentity, { cause: 404 });
    ensDomain = handle;
    try {
      address = await client
        .getEnsAddress({
          name: ensDomain,
        })
        .then((res: string) => res);
    } catch (e) {
      console.log("error", e);
    }

    if (!address || !isValidEthereumAddress(address)) {
      throw new Error(ErrorMessages.invalidResolved, { cause: 404 });
    }

    resolver = (await getENSProfile(ensDomain))?.[0] || null;

    if (!resolver || (!resolver.resolver && !address))
      throw new Error(ErrorMessages.invalidResolver, { cause: 404 });
    if (resolver?.message) throw new Error(resolver.message);
  }

  return {
    address,
    ensDomain,
    earlyReturnJSON: null,
    textRecords: resolver?.resolver?.texts,
    contentHash: resolver?.resolver?.contentHash,
  };
};

export const resolveENSHandle = async (handle: string) => {
  const { address, ensDomain, earlyReturnJSON, textRecords, contentHash } =
    await resolveENSResponse(handle);
  if (earlyReturnJSON) {
    return earlyReturnJSON;
  }
  let linksObj = {};
  if (textRecords?.length > 0) {
    const linksToFetch = textRecords.reduce(
      (pre: Array<string>, cur: string) => {
        if (!ensRecordsDefaultOrShouldSkipText.includes(cur)) pre.push(cur);
        return pre;
      },
      []
    );

    const getLink = async () => {
      const _linkRes: { [index: string]: any } = {};
      for (let i = 0; i < linksToFetch.length; i++) {
        const recordText = linksToFetch[i];
        const key =
          Object.values(PlatformData).find((o) =>
            o.ensText?.includes(recordText.toLowerCase())
          )?.key || null;
        if (key) {
          const textValue = await resolveENSTextValue(ensDomain, recordText);
          const handle = resolveHandle(textValue, key as PlatformType);
          if (textValue && handle) {
            const resolvedKey =
              key === PlatformType.url
                ? PlatformType.website
                : (key as PlatformType);
            _linkRes[resolvedKey] = {
              link: getSocialMediaLink(handle, resolvedKey),
              handle: handle,
            };
          }
        }
      }
      return _linkRes;
    };
    linksObj = await getLink();
  }

  const headerHandle = await getHeaderTextValue(textRecords, ensDomain);
  const avatarHandle = (await resolveENSTextValue(ensDomain, "avatar")) || null;
  const resJSON = {
    address: address.toLowerCase(),
    identity: ensDomain,
    platform: PlatformType.ens,
    displayName: (await resolveENSTextValue(ensDomain, "name")) || ensDomain,
    avatar: avatarHandle ? await resolveEipAssetURL(avatarHandle) : null,
    description: (await resolveENSTextValue(ensDomain, "description")) || null,
    email: (await resolveENSTextValue(ensDomain, "email")) || null,
    location: (await resolveENSTextValue(ensDomain, "location")) || null,
    header: (await resolveEipAssetURL(headerHandle)) || null,
    contenthash: decodeContenthash(contentHash),
    links: linksObj,
  };
  return resJSON;
};

export const getENSProfile = async (name: string) => {
  try {
    const payload = {
      query: getENSRecordsQuery,
      variables: {
        name,
      },
    };
    const fetchRes = await fetch(ensSubGraphBaseURL, {
      ...commonQueryOptions,
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    if (fetchRes) return fetchRes.data?.domains || fetchRes.errors;
  } catch (e) {
    return null;
  }
};
