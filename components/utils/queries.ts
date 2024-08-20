import { gql } from "@apollo/client";
import { PlatformType } from "./platform";

export const platformsToExclude = [
  PlatformType.dotbit,
  PlatformType.sns,
  PlatformType.solana,
];

export const GET_AVAILABLE_DOMAINS = gql`
  query GET_AVAILABLE_DOMAINS($name: String) {
    domainAvailableSearch(name: $name) {
      platform
      name
      expiredAt
      availability
      status
    }
  }
`;

const GET_PROFILES = gql`
  query GET_PROFILES($platform: String, $identity: String) {
    identity(platform: $platform, identity: $identity) {
      id
      identity
      platform
      displayName
      uid
      reverse
      expiredAt
      resolveAddress {
        chain
        address
      }
      ownerAddress {
        chain
        address
      }
      identityGraph {
        vertices {
          uuid
          identity
          platform
          displayName
          uid
          reverse
          expiredAt
          resolveAddress {
            chain
            address
          }
          ownerAddress {
            chain
            address
          }
          nft(category: ["ens", "sns"]) {
            id
            uuid
            chain
            source
          }
        }
        edges {
          source
          target
          dataSource
          edgeType
        }
      }
    }
  }
`;

const GET_PROFILES_MINIFY = `
query GET_PROFILES($platform: String, $identity: String) {
  identity(platform: $platform, identity: $identity) {
    identity
    platform
    displayName
    uid
    reverse
    expiredAt
    identityGraph{
      vertices {
        uuid
        identity
        platform
        displayName
        uid
        reverse
        expiredAt
      }
    }
  }
}`;

export const getProfileQuery = (minify?: Boolean) => {
  return minify ? GET_PROFILES_MINIFY : GET_PROFILES;
};

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
export const profileAPIBaseURL =
  process.env.NEXT_PUBLIC_PROFILE_END_POINT || "https://api.web3.bio";
export const articleAPIBaseURL = "https://article-api.web3.bio";

export const queryClient = async (path: string) => {
  return await fetch(baseURL + "/api" + path);
};
