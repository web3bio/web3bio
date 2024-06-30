import { gql } from "@apollo/client";

export const AIRSTACK_GRAPHQL_ENDPOINT = "https://api.airstack.xyz/gql";

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
