import client from "./apollo";
import { GET_PROFILE_LENS } from "./lens";
import { GET_PROFILES_DOMAIN, GET_PROFILES_QUERY } from "./queries";
import { PlatformType } from "./type";
import { isDomainSearch } from "./utils";

export const identityProvider = async (platform: string, name: string) => {
  const lensSearchParams = {
    query: GET_PROFILE_LENS,
    variables: {
      identity: name,
    },
    context: {
      uri: process.env.NEXT_PUBLIC_LENS_GRAPHQL_SERVER,
    },
  };
  const domainSearchParams = {
    query: isDomainSearch(platform) ? GET_PROFILES_DOMAIN : GET_PROFILES_QUERY,
    variables: {
      platform: platform,
      identity: name,
    },
  };

  const data = await client.query(
    platform === PlatformType.lens ? lensSearchParams : domainSearchParams
  );
  return data;
};
