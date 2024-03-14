import { gql } from "@apollo/client";

export const GET_PROFILES = gql`
  query GET_PROFILES($platform:String, $identity: String) {
  identity(platform: $platform, identity: $identity) {
    identity
    platform
    displayName
    uid
    reverse
    expiredAt
    ownedBy {
      identity
      platform
      displayName
      uid
      reverse
      expiredAt
    }
    identityGraph(reverse: true) {
      vertices {
        identity
        platform
        displayName
        uid
        reverse
        expiredAt
        nft(category: [ENS]) {
          id
          uuid
          transaction
          source
        }
        ownedBy {
          identity
          platform
          displayName
          uid
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
