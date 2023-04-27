import { Web3bioProfileAPIEndpoint } from "../../utils/api";
import { PlatformType } from "../../utils/platform";

const resolveSearchHandle = (identity) => {
  return {
    [PlatformType.ethereum]: identity.displayName || identity.identity,
    [PlatformType.twitter]: identity.identity,
    [PlatformType.farcaster]: identity.identity,
    [PlatformType.dotbit]: identity.identity,
    [PlatformType.lens]: identity.identity,
  }[identity.platform];
};
export const fetchProfile = async (identity) => {
  try {
    const handle = resolveSearchHandle(identity)
    const platform =
      identity.platform === PlatformType.ethereum
        ? PlatformType.ens
        : identity.platform;
    const url = Web3bioProfileAPIEndpoint + `/profile/${platform.toLowerCase()}/${handle}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    return await res.json();
  } catch (e) {
  
    return null;
  }
};
