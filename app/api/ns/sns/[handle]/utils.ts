import { clusterApiUrl, Connection } from "@solana/web3.js";
import { Record as SNSRecord } from "@bonfida/spl-name-service";
import { PlatformType } from "../../../../../components/utils/platform";
import { regexSns } from "../../../../../components/utils/regexp";
import { formatText } from "../../../../../components/utils/utils";
import {
  resolveSNSDomain,
  reverseWithProxy,
  getSNSRecord,
} from "../../../profile/sns/[handle]/utils";

export const resolveSNSHandleNS = async (handle: string) => {
  let domain = "",
    address = "";
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  if (regexSns.test(handle)) {
    domain = handle;
    address = await resolveSNSDomain(connection, handle);
  } else {
    address = handle;
    domain = await reverseWithProxy(handle);
  }
  if (!domain) {
    return {
      address: address,
      identity: address,
      platform: PlatformType.solana,
      displayName: formatText(address),
      avatar: null,
      description: null,
    };
  }
  const resJSON = {
    address: address,
    identity: domain,
    platform: PlatformType.sns,
    displayName: domain,
    avatar: await getSNSRecord(connection, domain, SNSRecord.Pic),
    description: await getSNSRecord(connection, domain, SNSRecord.TXT),
  };
  return resJSON;
};
