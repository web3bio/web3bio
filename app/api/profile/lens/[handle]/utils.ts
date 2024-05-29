import { isAddress } from "viem";
import {
  errorHandle,
  getSocialMediaLink,
  isValidEthereumAddress,
  resolveEipAssetURL,
  resolveHandle,
  respondWithCache,
} from "../../../../../components/utils/utils";
import {
  LensGraphQLEndpoint,
  LensParamType,
  LensProtocolProfileCollectionAddress,
  getLensProfileQuery,
} from "../../../../../components/utils/lens";
import {
  ErrorMessages,
  LinksItem,
} from "../../../../../components/utils/types";
import {
  PlatformData,
  PlatformType,
} from "../../../../../components/utils/platform";
export const getLensProfile = async (handle: string, type: LensParamType) => {
  const query = getLensProfileQuery(type);
  const variables = isAddress(handle)
    ? { request: { for: handle } }
    : { request: { forHandle: "lens/" + handle.replace(".lens", "") } };
  try {
    const payload = {
      query,
      variables,
    };
    const fetchRes = await fetch(LensGraphQLEndpoint, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "user-agent": "spectaql",
      },
    }).then((res) => res.json());
    if (fetchRes.error)
      return {
        error: fetchRes.error,
      };
    if (fetchRes)
      return fetchRes.data?.[
        type === LensParamType.address ? "defaultProfile" : "profile"
      ];
  } catch (e) {
    return null;
  }
};
export const resolveETHFromLens = async (lens: string) => {
  const response = await getLensProfile(lens, LensParamType.domain);
  return response.ownedBy;
};

export const resolveLensResponse = async (handle: string) => {
  let response;
  if (isValidEthereumAddress(handle)) {
    response = await getLensProfile(handle, LensParamType.address);
  } else {
    response = await getLensProfile(handle, LensParamType.domain);
  }
  return response;
};
export const resolveLensHandle = async (handle: string) => {
  const response = await resolveLensResponse(handle);
  if (!response?.id) throw new Error(ErrorMessages.notFound, { cause: 404 });
  if (response.error) throw new Error(response.error, { cause: 500 });
  const pureHandle = response.handle.localName;
  let linksObj = {
    [PlatformType.lens]: {
      link: getSocialMediaLink(pureHandle, PlatformType.lens),
      handle: pureHandle,
    },
  };
  if (response.metadata?.attributes) {
    const linksRecords = response.metadata.attributes;
    const linksToFetch = linksRecords.reduce(
      (pre: Array<any>, cur: { key: string }) => {
        if (Object.keys(PlatformData).includes(cur.key)) pre.push(cur.key);
        return pre;
      },
      []
    );
    const getLink = async () => {
      const _linkRes: Partial<Record<string, LinksItem>> = {};
      for (let i = 0; i < linksToFetch.length; i++) {
        const recordText = linksToFetch[i];
        const handle = resolveHandle(
          linksRecords?.find((o: { key: any }) => o.key === recordText)?.value,
          recordText
        );
        if (handle) {
          const resolvedHandle =
            recordText === PlatformType.twitter
              ? handle.replaceAll("@", "")
              : handle;
          _linkRes[recordText] = {
            link: getSocialMediaLink(resolvedHandle, recordText),
            handle: resolvedHandle,
          };
        }
      }
      return _linkRes;
    };
    linksObj = {
      ...linksObj,
      ...(await getLink()),
    };
  }
  const avatarUri =
    response.metadata?.picture?.raw?.uri ||
    response.metadata?.picture?.optimized?.uri ||
    (await resolveEipAssetURL(
      `eip155:137/erc721:${LensProtocolProfileCollectionAddress}/${parseInt(
        response.id?.slice(2),
        16
      )}`
    ));
  const coverPictureUri =
    response.metadata?.coverPicture?.optimized?.url ||
    response.metadata?.coverPicture?.raw?.uri ||
    null;
  const resJSON = {
    address: response.ownedBy?.address?.toLowerCase(),
    identity: response.handle.localName + ".lens",
    platform: PlatformType.lens,
    displayName:
      response.metadata?.displayName || response.handle.localName + ".lens",
    avatar: (await resolveEipAssetURL(avatarUri)) || null,
    email: null,
    description: response.metadata?.bio || null,
    location:
      response.metadata?.attributes?.find(
        (o: { key: string }) => o.key === "location"
      )?.value || null,
    header: (await resolveEipAssetURL(coverPictureUri)) || null,
    contenthash: null,
    links: linksObj,
  };
  return resJSON;
};

export const resolveLensRespond = async (handle: string) => {
  try {
    const json = await resolveLensHandle(handle);
    return respondWithCache(JSON.stringify(json));
  } catch (e: any) {
    return errorHandle({
      identity: handle,
      platform: PlatformType.lens,
      code: e.cause || 500,
      message: e.message,
    });
  }
};
