import { gql } from "@apollo/client";

// Relation Service Query
const GET_PROFILES = gql`
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
          nft(category: ["ens", "sns"]) {
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

// Relation Service Minified Query
const GET_PROFILES_MINIFY = `
query GET_PROFILES($platform: String, $identity: String) {
  identity(platform: $platform, identity: $identity) {
    identity
    platform
    displayName
    uid
    reverse
    expiredAt
    identityGraph{
      vertices {
        uuid
        identity
        platform
        displayName
        uid
        reverse
        expiredAt
      }
    }
  }
}`;

// Relation Service Availability Query
export const GET_AVAILABLE_DOMAINS = gql`
  query GET_AVAILABLE_DOMAINS($name: String) {
    domainAvailableSearch(name: $name) {
      platform
      name
      expiredAt
      availability
      status
    }
  }
`;

// Farcaster Modal Stats
export const QUERY_FARCASTER_STATS = gql`
  query QUERY_FARCASTER_STATS($name: String!) {
    Socials(
      input: {
        filter: { profileName: { _in: [$name] }, dappName: { _eq: farcaster } }
        blockchain: ethereum
      }
    ) {
      Social {
        isFarcasterPowerUser
        socialCapital {
          socialCapitalScore
          socialCapitalRank
        }
      }
    }
  }
`;

// Philand Widget
export const QUERY_PHILAND_INFO = gql`
  query QUERY_PHILAND_LIST($name: String!) {
    philandImage(input: { name: $name, transparent: true }) {
      imageurl
    }
    philandLink(input: { name: $name }) {
      data {
        title
        url
      }
    }
  }
`;

// Snapshot Widget
export const QUERY_SPACES_FOLLOWED_BY_USR = gql`
  query userFollowedSpaces($address: String!) {
    follows(where: { follower: $address }) {
      space {
        id
        name
        about
        network
        members
        admins
        github
        twitter
        website
        coingecko
        followersCount
        proposalsCount
        verified
      }
      created
    }
  }
`;

// Tally Widget
export const QUERY_TALLY_DAOS = gql`
  query TallyDAO($delegate: DelegatesInput!, $delegatee: DelegationsInput!) {
    delegates(input: $delegate) {
      nodes {
        ... on Delegate {
          id
          delegatorsCount
          votesCount
          organization {
            id
            name
            tokenOwnersCount
            delegatesVotesCount
            slug
            metadata {
              icon
            }
          }
        }
      }
    }
    delegatees(input: $delegatee) {
      nodes {
        ... on Delegation {
          delegate {
            id
          }
          delegator {
            name
            address
            ens
          }
          votes
          token {
            decimals
            name
            symbol
          }
          organization {
            name
            slug
            metadata {
              icon
            }
          }
        }
      }
    }
  }
`;

export const getProfileQuery = (minify?: Boolean) => {
  return minify ? GET_PROFILES_MINIFY : GET_PROFILES;
};