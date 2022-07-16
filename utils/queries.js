import { gql } from '@apollo/client'

export const GET_PROFILES_ENS = (ens) => gql`
  query($ens: String) {
    nft(chain: "ethereum", category: "ENS", id: $ens) {
      uuid
      updatedAt
      owner {
        uuid
        platform
        identity
        displayName
        neighbor(depth: 2) {
          uuid
          platform
          identity
          displayName
        }
      }
    }
  }
`;