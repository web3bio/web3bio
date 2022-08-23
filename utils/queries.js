import { gql } from '@apollo/client'

export const GET_PROFILES_ENS = gql`
  query($ens: String) {
    nft(chain: "ethereum", category: "ENS", id: $ens) {
      owner {
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
        neighbor(depth: 3) {
          sources
          identity {
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
  }
`;

export const GET_PROFILES_QUERY = gql`
  query($platform: String, $identity: String) {
    identity(platform: $platform, identity: $identity) {
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
      neighbor(depth: 3) {
        sources
        identity {
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