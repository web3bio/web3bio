import { gql } from "@apollo/client";

export const TALLY_GRAPHQL_ENDPOINT = "https://api.tally.xyz/query";
export const TALLY_AUTH = process.env.NEXT_PUBLIC_TALLY_API_KEY || "";

export const QUERY_DAO_DELEGATORS = gql`
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
        ... on DelegationV2 {
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
          governor {
            id
            name
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
  }
`;
