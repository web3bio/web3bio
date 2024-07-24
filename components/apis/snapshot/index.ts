import { gql } from "@apollo/client";

export const SNAPSHOT_GRAPHQL_ENDPOINT = "https://hub.snapshot.org/graphql";
export const QUERY_SPACES_FOLLOWED_BY_USR = gql`
  query userFollowedSpaces($address: String!) {
    follows(where: { follower: $address }) {
      follower
      space {
        id
        name
        network
        symbol
        members
        avatar
      }
      created
    }
  }
`;

export const QUERY_SPACE_BY_ID = gql`
  query spaceById($id: String!) {
    space(id: $id) {
      id
      name
      about
      network
      symbol
      members
      admins
      terms
      skin
      github
      twitter
      website
      coingecko
      followersCount
    }
  }
`;
