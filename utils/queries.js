import { gql } from '@apollo/client'

export const GET_PROFILES_ENS = gql`
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

export const GET_PROFILES_ETH = gql`
  query($eth: String) {
    identity(platform: "ethereum", identity: $eth) {
      status
      platform
      identity
      updatedAt
      nft {
        category
        chain
        id
        updatedAt
      }
      neighbor(depth: 3) {
        status
        platform
        identity
        updatedAt
        nft {
          category
          chain
          id
          updatedAt
        }
      }
    }
  }
`;

export const GET_PROFILES_TWITTER = gql`
  query($twitter: String) {
    identity(platform: "twitter", identity: $twitter) {
      platform
      identity
      updatedAt
      neighbor(depth: 3) {
        platform
        identity
        updatedAt
        nft {
          chain
          contract
          id
          updatedAt
        }
      }
    }
  }
`;

export const GET_PROFILES_NEXT = gql`
  query($nextid: String) {
    identity(platform: "nextid", identity: $nextid) {
      status
      platform
      identity
      updatedAt
      nft {
        chain
        contract
        id
        updatedAt
      }
      neighbor(depth: 3) {
        status
        platform
        identity
        updatedAt
        nft {
          chain
          contract
          id
          updatedAt
        }
      }
    }
  }
`;