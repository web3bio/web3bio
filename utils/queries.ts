import { gql } from "@apollo/client";

export const GET_PROFILES_DOMAIN = gql`
  query GET_PROFILES_DOMAIN($platform: String, $identity: String) {
    domain(domainSystem: $platform, name: $identity) {
      source
      system
      name
      fetcher
      resolved {
        identity
        platform
        displayName
      }
      owner {
        identity
        platform
        displayName
        uuid
        nft(category: ["ENS"], limit: 100, offset: 0) {
          uuid
          category
          chain
          id
        }
        neighborWithTraversal(depth: 5) {
          ... on ProofRecord {
            __typename
            source
            from {
              nft(category: ["ENS"], limit: 100, offset: 0) {
                uuid
                category
                chain
                id
              }
              uuid
              platform
              identity
              displayName
            }
            to {
              nft(category: ["ENS"], limit: 100, offset: 0) {
                uuid
                category
                chain
                id
              }
              uuid
              platform
              identity
              displayName
            }
          }
          ... on HoldRecord {
            __typename
            source
            from {
              nft(category: ["ENS"], limit: 100, offset: 0) {
                uuid
                category
                chain
                id
              }
              uuid
              platform
              identity
              displayName
            }
            to {
              nft(category: ["ENS"], limit: 100, offset: 0) {
                uuid
                category
                chain
                id
              }
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
      platform
      identity
      displayName
      uuid
      ownedBy {
        uuid
        platform
        identity
        displayName
      }
      nft(category: ["ENS"], limit: 100, offset: 0) {
        uuid
        category
        chain
        address
        id
      }
      neighborWithTraversal(depth: 5) {
        ... on ProofRecord {
          source
          from {
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            platform
            identity
            displayName
          }
          to {
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            platform
            identity
            displayName
          }
        }
        ... on HoldRecord {
          source
          from {
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            platform
            identity
            displayName
          }
          to {
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            platform
            identity
            displayName
          }
        }
      }
    }
  }
`;

export function matchQuery(query) {
  if (!query) return "";
  return query.includes(".")
    ? query.split(".")[0]
    : query.includes("。")
    ? query.split("。")[0]
    : query;
}