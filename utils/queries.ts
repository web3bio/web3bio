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
      followingTopology(hop: 1) {
        dataSource
        source
        target
        originalSource {
          id
          uid
          platform
          identity
          displayName
        }
        originalTarget {
          id
          uid
          platform
          identity
          displayName
        }
      }
      followerTopology(hop: 1) {
        dataSource
        source
        target
        originalSource {
          id
          uid
          platform
          identity
          displayName
        }
        originalTarget {
          id
          uid
          platform
          identity
          displayName
        }
      }
    }
  }
`;

export const GET_PROFILE_IDENTITY_GRAPH = gql`
  query ($graphId: String) {
    queryIdentityGraph(filter: { byGraphId: [$graphId] }) {
      graphId
      vertices {
        id
        platform
        identity
        displayName
      }
      edges {
        source
        target
        dataSource
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
