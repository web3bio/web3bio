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
          nft(category: [ens, sns]) {
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

export const GET_SOCIAL_GRAPH = gql`
  query GET_SOCIAL_GRAPH {
    relation(platform: "lens", identity: "sujiyan.lens") {
      identityGraph {
        graphId
      }
      follow(hop: 1, limit: 20, offset: 0) {
        count
        relation {
          edgeType
          tag
          dataSource
          source
          target
          sourceDegree
          targetDegree
          originalSource {
            id
            uuid
            identity
            platform
            displayName
            uid
          }
          originalTarget {
            id
            uuid
            identity
            platform
            displayName
            uid
          }
        }
      }
    }
  }
`;
