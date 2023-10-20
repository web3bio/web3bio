import {
  SIMPLEHASH_URL,
  SIMPLEHASH_CHAINS,
  SIMPLEHASH_PAGE_SIZE,
} from "../../components/apis/simplehash";
import { PlatformType } from "../../utils/platform";

const resolveSearchHandle = (identity) => {
  return {
    [PlatformType.ethereum]: identity.displayName || identity.identity,
    [PlatformType.farcaster]: identity.identity,
    [PlatformType.lens]: identity.identity,
  }[identity.platform];
};
export const fetchProfile = async (identity) => {
  try {
    const handle = resolveSearchHandle(identity);
    if (!handle) return null;

    const platform =
      identity.platform === PlatformType.ethereum
        ? PlatformType.ens
        : identity.platform;
    const url =
      process.env.NEXT_PUBLIC_PROFILE_END_POINT +
      `/profile/${platform.toLowerCase()}/${handle}`;
    console.time(`Profile api call for ${handle}`);
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });
    console.timeEnd(`Profile api call for ${handle}`);
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const fetchInitialNFTsData = async (address) => {
  try {
    const url =
      SIMPLEHASH_URL +
      `/api/v0/nfts/owners_v2?chains=${SIMPLEHASH_CHAINS}&wallet_addresses=${address}&filters=spam_score__lte=1&limit=${SIMPLEHASH_PAGE_SIZE}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });
    return await res.json();
  } catch (e) {
    return [];
  }
};
