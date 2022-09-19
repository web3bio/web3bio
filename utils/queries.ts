import { gql } from "@apollo/client";

export const GET_PROFILES_ENS = gql`
  query GET_PROFILES_ENS ($ens: String) {
    nft(chain: "ethereum", category: "ENS", id: $ens) {
      owner {
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
        nft {
          uuid
          category
          chain
          id
        }
        neighbor(depth: 5) {
          sources
          identity {
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
            nft {
              uuid
              category
              chain
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_PROFILES_QUERY = gql`
  query GET_PROFILES_QUERY ($platform: String, $identity: String) {
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
      nft {
        uuid
        category
        chain
        id
      }
      neighbor(depth: 5) {
        sources
        identity {
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
          nft {
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

export const GET_IDENTITY_GRAPH_DATA = gql`
  query GET_IDENTITY_GRAPH_DATA ($platform: String, $identity: String) {
    identity(platform: $platform, identity: $identity) {
      status
      uuid
      displayName
      createdAt
      addedAt
      updatedAt
      neighborWithTraversal(depth: 5) {
        source
        from {
          uuid
          platform
          identity
          displayName
          nft {
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
          nft {
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

export const GET_IDENTITY_GRAPH_ENS = gql`
  query GET_IDENTITY_GRAPH_ENS ($id: String) {
    nft(chain: "ethereum", category: "ENS", id: $id) {
      owner {
        platform
        identity
        neighborWithTraversal(depth: 5) {
          source
          from {
            platform
            identity
            uuid
            displayName
            nft {
              category
              chain
              id
              uuid
            }
          }
          to {
            platform
            identity
            uuid
            displayName
            nft {
              category
              chain
              id
              uuid
            }
          }
        }
      }
    }
  }
`;
