import {
  SIMPLEHASH_CHAINS,
  SIMPLEHASH_PAGE_SIZE,
  SIMPLEHASH_URL,
  profileAPIBaseURL
} from "../utils/api";
import { shouldPlatformFetch } from "../utils/utils";

export const fetchProfile = async (identity) => {
  try {
    const handle = identity.identity;
    if (!handle || !shouldPlatformFetch(identity.platform)) return null;

    const platform = identity.platform;
    console.time(`Profile API call for ${handle}`);
    const res = await fetch(
      profileAPIBaseURL + `/ns/${platform.toLowerCase()}/${handle}`,
      {
        next: { revalidate: 86400 },
      }
    );
    console.timeEnd(`Profile API call for ${handle}`);
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
