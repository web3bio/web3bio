import { gql } from "@apollo/client";

export const PHI_GRAPHQL_END_POINT = "https://graph-api.phi.blue/graphql";
export const PHI_AUTH = process.env.NEXT_PUBLIC_PHI_API_KEY || '';

export const QUERY_PHILAND_INFO = gql`
  query QUERY_PHILAND_LIST($name: String!) {
    philandImage(input: {name: $name, transparent: true}) {
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
