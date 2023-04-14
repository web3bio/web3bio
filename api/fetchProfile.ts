import { PlatformType } from "../utils/platform";

const resolveSearchHandle = (identity) => {
  return {
    [PlatformType.ethereum]: identity.displayName,
    [PlatformType.twitter]: identity.identity,
    [PlatformType.farcaster]: identity.identity,
    [PlatformType.dotbit]: identity.identity,
    [PlatformType.lens]: identity.identity,
  }[identity.platform];
};
export const fetchProfile = async (identity) => {
  try {
    const handle = resolveSearchHandle(identity);
    const platform =
      identity.platform === PlatformType.ethereum
        ? PlatformType.ens
        : identity.platform;
    const host = window.location.origin || "https://staging.web5.bio";
    const url = host + `/api/profile/${platform.toLowerCase()}/${handle}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    return await res.json();
  } catch (e) {
    console.error(e, "error");
    return null;
  }
};
