import { CoinType } from "../../../../../components/utils/cointype";
import { PlatformType } from "../../../../../components/utils/platform";
import { ErrorMessages } from "../../../../../components/utils/types";
import {
  isValidEthereumAddress,
  resolveHandle,
  getSocialMediaLink,
} from "../../../../../components/utils/utils";

const DotbitEndPoint = "https://indexer-v1.did.id/";

export interface RecordItem {
  key: string;
  label: string;
  value: string;
  ttl: string;
}

export const fetchDotbitProfile = async (path: string, payload: string) => {
  const response = await fetch(DotbitEndPoint + path, {
    method: "POST",
    body: payload,
  }).then((res) => res.json());
  return response?.data;
};

export const resolveDotbitResponse = async (handle: string) => {
  let domain;
  let address;
  if (isValidEthereumAddress(handle)) {
    const res = await fetchDotbitProfile(
      "v1/reverse/record",
      JSON.stringify({
        type: "blockchain",
        key_info: {
          coin_type: CoinType.eth.toString(),
          key: handle,
        },
      })
    );
    if (!res?.account) {
      throw new Error(ErrorMessages.notFound, { cause: 404 });
    }
    address = handle;
    domain = res.account;
  } else {
    const res = await fetchDotbitProfile(
      "v1/account/info",
      JSON.stringify({ account: handle })
    );

    if (!res) {
      throw new Error(ErrorMessages.notFound, { cause: 404 });
    }
    domain = res.account_info.account || handle;
    address = res.account_info.owner_key.toLowerCase();
  }
  const recordsResponse = await fetchDotbitProfile(
    "v1/account/records",
    JSON.stringify({ account: domain })
  );

  const recordsMap = new Map<string, RecordItem>(
    recordsResponse?.records?.map((x: RecordItem) => [x.key, { ...x }])
  );

  return {
    domain,
    address,
    recordsMap,
  };
};

export const resolveDotbitHandle = async (handle: string) => {
  let avatar;
  let location;
  let header;
  const { address, domain, recordsMap } = await resolveDotbitResponse(handle);
  const linksObj: Record<
    string,
    {
      link: string;
      handle: string;
    }
  > = {};
  recordsMap.forEach((x) => {
    if (x.key.includes("profile.")) {
      const platform = x.key.replace("profile.", "");
      if (platform === "avatar") avatar = x.value;
      if (x.key.toLowerCase().includes("header")) header = x.value;
      if (x.key.toLowerCase().includes("location")) location = x.value;
      if (!["description", "email", "avatar"].includes(platform) && x.value) {
        const _handle = resolveHandle(x.value, platform as PlatformType)!;
        linksObj[platform] = {
          link: getSocialMediaLink(x.value, platform as PlatformType)!,
          handle: _handle,
        };
      }
    }
  });
  const contenthashItem = Array.from(recordsMap).find((x) =>
    x[0].startsWith("dweb")
  )?.[1];

  return {
    address,
    identity: domain,
    platform: PlatformType.dotbit,
    displayName: domain || null,
    avatar: avatar || null,
    description: recordsMap.get("profile.description")?.value || null,
    email: recordsMap.get("profile.email")?.value || null,
    location: location || null,
    header: header || null,
    contenthash: contenthashItem
      ? `${contenthashItem.key.replace("dweb.", "")}://${contenthashItem.value}`
      : null,
    links: linksObj,
  };
};
