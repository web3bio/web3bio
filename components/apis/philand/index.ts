import { gql } from "@apollo/client";

export const PHI_GRAPHQL_END_POINT = "https://graph-api.phi.blue/graphql";
export const PHI_AUTH = process.env.NEXT_PUBLIC_PHI_API_KEY;

export const QUERY_PHILAND_LIST = gql`
  query QUERY_PHILAND_LIST($address: String!) {
    philandList(input: { address: $address, transparent: true }) {
      data {
        name
        landurl
        imageurl
      }
    }
  }
`;

export const QUERY_PHILAND_RANK = gql`
  query QUERY_PHILAND_RANK($address: String!) {
    phiRank(input: { address: $address }) {
      data {
        rank
        tokenid
      }
    }
  }
`;
