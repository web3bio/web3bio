import { gql } from "@apollo/client";

export const SNAPSHOT_GRAPHQL_ENDPOINT = "https://hub.snapshot.org/graphql";
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
      }
      created
    }
  }
`;
