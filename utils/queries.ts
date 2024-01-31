import { gql } from "@apollo/client";

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
