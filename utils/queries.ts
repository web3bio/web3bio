import { gql } from "@apollo/client";
import { PlatformType } from "./type";
import { isDomainSearch } from "./utils";

export const GET_PROFILES_DOMAIN = gql`
  query GET_PROFILES_DOMAIN($platform: String, $identity: String) {
    domain(domainSystem: $platform, name: $identity) {
      owner {
        uuid
        platform
        identity
        displayName
        nft(category: ["ENS"]) {
          uuid
          category
          chain
          id
        }
        neighborWithTraversal(depth: 5) {
          source
          from {
            platform
            identity
            uuid
            displayName
            nft(category: ["ENS"]) {
              category
              chain
              id
              uuid
            }
            ownedBy {
              uuid
              platform
              identity
              displayName
            }
          }
          to {
            platform
            identity
            uuid
            displayName
            nft(category: ["ENS"]) {
              category
              chain
              id
              uuid
            }
            ownedBy {
              uuid
              platform
              identity
              displayName
            }
          }
        }
      }
    }
  }
`;

export const GET_PROFILES_QUERY = gql`
  query GET_PROFILES_QUERY($platform: String, $identity: String) {
    identity(platform: $platform, identity: $identity) {
      uuid
      platform
      identity
      displayName
      ownedBy {
        uuid
        platform
        identity
        displayName
      }
      nft(category: ["ENS"]) {
        uuid
        category
        chain
        id
      }
      neighborWithTraversal(depth: 5) {
        source
        from {
          uuid
          platform
          identity
          displayName
          ownedBy {
            uuid
            platform
            identity
            displayName
          }
          nft(category: ["ENS"]) {
            uuid
            category
            chain
            id
          }
        }
        to {
          uuid
          platform
          identity
          displayName
          ownedBy {
            uuid
            platform
            identity
            displayName
          }
          nft(category: ["ENS"]) {
            uuid
            category
            chain
            id
          }
        }
      }
    }
  }
`;


export const _identity = (ini, iniP) => {
  if (!ini) return null;
  if (iniP === PlatformType.lens) return ini.profile;
  if (isDomainSearch(iniP)) {
    if (ini.domain) return ini.domain.owner;
  }
  return ini.identity;
};