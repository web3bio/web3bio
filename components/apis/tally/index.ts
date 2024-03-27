import { gql } from "@apollo/client";

export const TALLY_GRAPHQL_ENDPOINT = "https://api.tally.xyz/query";
export const TALLY_AUTH = process.env.NEXT_PUBLIC_TALLY_API_KEY || "";

export const QUERY_DAO_DELEGATORS = gql`
  query AddressGovernancesDelegators($input: DelegatesInput!) {
    delegates(input: $input) {
      nodes {
        ... on Delegate {
          id
          delegatorsCount
          votesCount
          account {
            name
            address
            ens
            picture
          }
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
      pageInfo {
        firstCursor
        lastCursor
      }
    }
  }
`;

export const QUERY_DAO_DELEGATING_TO = gql`
  query AddressGovernancesDelegatees($input: DelegationsInput!) {
    delegatees(input: $input) {
      nodes {
        ... on DelegationV2 {
          delegate {
            id
            account {
              name
              address
              ens
              picture
            }
          }
          delegator {
            name
            address
            ens
            picture
          }
          governor {
            id
            tokenStats {
              delegatedVotingPower
              supply
            }
            name
            quorum
            kind
            organization {
              name
              slug
              metadata {
                icon
              }
            }
            tokens {
              decimals
            }
          }
        }
      }
      pageInfo {
        firstCursor
        lastCursor
      }
    }
  }
`;
