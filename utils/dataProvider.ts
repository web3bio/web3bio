import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT
} from "../components/apis/nftscan";
import { POAPFetcher, POAP_END_POINT } from "../components/apis/poap";
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

  const res = await client.query(
    platform === PlatformType.lens ? lensSearchParams : domainSearchParams
  );
  return res.data;
};

export const poapsProvider = async (address: string) => {
  return await POAPFetcher(POAP_END_POINT + address || "");
};

export const nftCollectionProvider = async (address: string) => {
  return await NFTSCANFetcher(
    NFTSCAN_BASE_API_ENDPOINT +
      `account/own/all/${address || ""}}?erc_type=erc721`
  );
};
