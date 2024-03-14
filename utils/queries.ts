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

export const GET_PROFILES_QUERY = gql`
  query GET_PROFILES_QUERY($platform: String, $identity: String) {
    identity(platform: $platform, identity: $identity) {
      platform
      identity
      displayName
      uuid
      uid
      reverse
      # expiredAt
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
            reverse
            # expiredAt
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            uid
            platform
            identity
            displayName
          }
          to {
            reverse
            # expiredAt
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            uid
            platform
            identity
            displayName
          }
        }
        ... on HoldRecord {
          source
          from {
            reverse
            # expiredAt
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            uid
            platform
            identity
            displayName
            ownedBy {
              platform
              identity
            }
          }
          to {
            reverse
            # expiredAt
            nft(category: ["ENS"], limit: 100, offset: 0) {
              uuid
              category
              chain
              id
            }
            uuid
            uid
            platform
            identity
            displayName
            ownedBy {
              platform
              identity
            }
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
