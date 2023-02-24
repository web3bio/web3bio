import { gql } from "@apollo/client";

export const GET_PROFILES_DOMAIN_CRYPTO = gql`
  query GET_PROFILES_DOMAIN($system: String, $identity: String) {
    domain(domainSystem: $system, name: $identity) {
      source
      system
      name
      fetcher
      resolved {
        identity
        platform
        displayName
      }
      owner {
        identity
        platform
        displayName
      }
    }
  }
`;

export const GET_PROFILES_QUERY_CRYPTO = gql`
  query GET_PROFILES_QUERY($system: String, $identity: String) {
    identity(platform: $system, identity: $identity) {
      uuid
      platform
      identity
      displayName
      ownedBy {
        uuid
        platform
        identity
        displayName
      }
      neighborWithTraversal(depth: 5) {
        source
        from {
          uuid
          platform
          identity
          displayName
        }
        to {
          platform
          identity
          displayName
        }
      }
    }
  }
`;
