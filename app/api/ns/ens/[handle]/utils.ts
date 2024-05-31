import { PlatformType } from "../../../../../components/utils/platform";
import {
  formatText,
  resolveEipAssetURL,
  respondWithCache,
  errorHandle,
} from "../../../../../components/utils/utils";
import {
  resolveENSResponse,
  resolveENSTextValue,
} from "../../../profile/ens/[handle]/utils";

export const resolveENSHandleNS = async (handle: string) => {
  const { address, ensDomain, earlyReturnJSON } = await resolveENSResponse(
    handle
  );
  if (earlyReturnJSON) {
    return {
      address: address,
      identity: address,
      platform: PlatformType.ethereum,
      displayName: formatText(address),
      avatar: null,
      description: null,
    };
  }

  const avatarHandle = (await resolveENSTextValue(ensDomain, "avatar")) || null;
  const resJSON = {
    address: address.toLowerCase(),
    identity: ensDomain,
    platform: PlatformType.ens,
    displayName: (await resolveENSTextValue(ensDomain, "name")) || ensDomain,
    avatar: avatarHandle ? await resolveEipAssetURL(avatarHandle) : null,

    description: (await resolveENSTextValue(ensDomain, "description")) || null,
  };
  return resJSON;
};

export const resolveENSRespondNS = async (handle: string) => {
  try {
    const json = await resolveENSHandleNS(handle);
    return respondWithCache(JSON.stringify(json));
  } catch (e: any) {
    return errorHandle({
      identity: handle,
      platform: PlatformType.ens,
      code: e.cause || 500,
      message: e.message,
    });
  }
};
