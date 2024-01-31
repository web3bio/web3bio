import { gql } from "@apollo/client";

// export const GET_PROFILES_DOMAIN = gql`
//   query GET_PROFILES_DOMAIN($platform: String, $identity: String) {
//     domain(domainSystem: $platform, name: $identity) {
//       source
//       system
//       name
//       fetcher
//       resolved {
//         reverse
//         identity
//         platform
//         displayName
//         neighborWithTraversal(depth: 5) {
//           ... on ProofRecord {
//             __typename
//             source
//             from {
//               reverse
//               nft(category: ["ENS"], limit: 100, offset: 0) {
//                 uuid
//                 category
//                 chain
//                 id
//               }
//               uuid
//               platform
//               identity
//               displayName
//             }
//             to {
//               reverse
//               nft(category: ["ENS"], limit: 100, offset: 0) {
//                 uuid
//                 category
//                 chain
//                 id
//               }
//               uuid
//               platform
//               identity
//               displayName
//             }
//           }
//           ... on HoldRecord {
//             __typename
//             source
//             from {
//               reverse
//               nft(category: ["ENS"], limit: 100, offset: 0) {
//                 uuid
//                 category
//                 chain
//                 id
//               }
//               uuid
//               uid
//               platform
//               identity
//               displayName
//               ownedBy {
//                 platform
//                 identity
//               }
//             }
//             to {
//               reverse
//               nft(category: ["ENS"], limit: 100, offset: 0) {
//                 uuid
//                 category
//                 chain
//                 id
//               }
//               uuid
//               uid
//               platform
//               identity
//               displayName
//               ownedBy {
//                 platform
//                 identity
//               }
//             }
//           }
//         }
//       }
//       owner {
//         reverse
//         identity
//         platform
//         displayName
//         uuid
//         nft(category: ["ENS"], limit: 100, offset: 0) {
//           uuid
//           category
//           chain
//           id
//         }
//       }
//     }
//   }
// `;

export const GET_PROFILE_SOCIAL_GRAPH = gql`
  query {
    socialFollows(platform: "lens", identity: "sujiyan.lens") {
      identityGraph {
        graphId
        vertices {
          id
          uid
          uuid
          identity
          platform
          displayName
        }
        edges {
          source
          target
          dataSource
        }
      }

      follower(hop: 1) {
        list {
          graphId
          vertices {
            id
            identity
            platform
            displayName
          }
          edges {
            dataSource
            source
            target
          }
        }
        topology {
          dataSource
          source
          target
          originalSource
          originalTarget
        }
      }

      following(hop: 1) {
        list {
          graphId
          vertices {
            id
            identity
            platform
            displayName
          }
          edges {
            dataSource
            source
            target
          }
        }
        topology {
          dataSource
          source
          target
          originalSource
          originalTarget
        }
      }
    }
  }
`;

export const GET_PROFILE_IDENTITY_GRAPH = ``

export function matchQuery(query) {
  if (!query) return "";
  return query.includes(".")
    ? query.split(".")[0]
    : query.includes("。")
    ? query.split("。")[0]
    : query;
}
