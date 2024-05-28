import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
  Record as SNSRecord,
  getRecordV2,
  resolve,
} from "@bonfida/spl-name-service";
import { formatText } from "@/utils/base";
import { PlatformType } from "@/utils/platform";
import { regexSns } from "@/utils/regexp";
import { getSocialMediaLink, resolveHandle } from "@/utils/resolver";
import { ErrorMessages } from "@/utils/types";

const SnsSDKProxyEndpoint = "https://sns-sdk-proxy.bonfida.workers.dev/";

export const reverseWithProxy = async (address: string) => {
  const res = await fetch(SnsSDKProxyEndpoint + "favorite-domain/" + address)
    .then((res) => res.json())
    .catch(() => null);
  if (!res || res?.s === "error") return "";
  return res?.result?.reverse + ".sol";
};

export const resolveWithProxy = async (handle: string) => {
  const res = await fetch(SnsSDKProxyEndpoint + "resolve/" + handle)
    .then((res) => res.json())
    .catch(() => null);
  if (!res || res?.s === "error") return "";
  return res?.result;
};

export const getSNSRecord = async (
  connection: Connection,
  domain: string,
  record: SNSRecord
) => {
  try {
    return await getRecordV2(connection, domain.slice(0, -4), record, {
      deserialize: true,
    }).then((res) => res?.deserializedContent);
  } catch (e) {
    return null;
  }
};

export const resolveSNSDomain = async (
  connection: Connection,
  handle: string
) => {
  try {
    return (await resolve(connection, handle))?.toBase58();
  } catch (e) {
    console.log(e, "error");
    return await resolveWithProxy(handle);
  }
};

const solanaRPCURL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");

const recordsShouldFetch = [
  SNSRecord.Twitter,
  SNSRecord.Telegram,
  SNSRecord.Reddit,
  SNSRecord.Url,
  SNSRecord.Github,
  SNSRecord.Discord,
  SNSRecord.CNAME,
];

export const resolveSNSHandle = async (handle: string) => {
  let domain, address;
  const connection = new Connection(solanaRPCURL);

  if (!connection) throw new Error(ErrorMessages.networkError, { cause: 500 });
  if (regexSns.test(handle)) {
    domain = handle;
    address = await resolveSNSDomain(connection, handle);
  } else {
    address = handle;
    domain = await reverseWithProxy(handle);
  }
  if (!address) {
    throw new Error(ErrorMessages.notFound, { cause: 404 });
  }
  if (address && !domain) {
    return {
      address,
      identity: address,
      platform: PlatformType.solana,
      displayName: formatText(address),
      avatar: null,
      description: null,
      email: null,
      location: null,
      header: null,
      contenthash: null,
      links: {},
    };
  }
  const linksObj: Record<
    string,
    {
      link: string;
      handle: string;
    }
  > = {};

  for (let i = 0; i < recordsShouldFetch.length; i++) {
    const recordType = recordsShouldFetch[i];
    const linkHandle = await getSNSRecord(connection, domain, recordType);
    if (linkHandle) {
      const resolved = resolveHandle(linkHandle);
      const type = [SNSRecord.CNAME, SNSRecord.Url].includes(recordType)
        ? PlatformType.website
        : recordType;
      linksObj[type] = {
        link: getSocialMediaLink(resolved, type)!,
        handle: resolved!,
      };
    }
  }

  const json = {
    address,
    identity: domain,
    platform: PlatformType.sns,
    displayName: domain || null,
    avatar: await getSNSRecord(connection, domain, SNSRecord.Pic),
    description: await getSNSRecord(connection, domain, SNSRecord.TXT),
    email: await getSNSRecord(connection, domain, SNSRecord.Email),
    location: null,
    header: await getSNSRecord(connection, domain, SNSRecord.Background),
    contenthash: await getSNSRecord(connection, domain, SNSRecord.IPFS),
    links: linksObj,
  };
  return json;
};
