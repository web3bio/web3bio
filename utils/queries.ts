import { gql } from "@apollo/client";

export const GET_PROFILES = gql`
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
          nft(category: [ENS]) {
            id
            uuid
            transaction
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
export function matchQuery(query) {
  if (!query) return "";
  return query.includes(".")
    ? query.split(".")[0]
    : query.includes("。")
    ? query.split("。")[0]
    : query;
}
