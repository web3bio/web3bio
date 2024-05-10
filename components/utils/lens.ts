import { gql } from "@apollo/client";

export const GET_PROFILE_LENS = gql`
  query Profile($request: ProfileRequest!) {
    profile(request: $request) {
      id
      ownedBy {
        chainId
        address
      }
      metadata {
        displayName
        bio
        rawURI
        appId
        coverPicture {
          optimized {
            uri
            mimeType
          }
          raw {
            mimeType
            uri
          }
        }
        attributes {
          value
          key
          type
        }
        picture {
          ... on ImageSet {
            raw {
              uri
              mimeType
            }
            optimized {
              mimeType
              uri
            }
          }
        }
      }
      onchainIdentity {
        proofOfHumanity
        sybilDotOrg {
          source {
            twitter {
              handle
            }
          }
          verified
        }
        worldcoin {
          isHuman
        }
      }
      stats {
        followers
        following
        comments
        posts
        mirrors
        quotes
        publications
      }
      interests
      handle {
        id
        fullHandle
        namespace
        localName
        suggestedFormatted {
          full
          localName
        }
        linkedTo {
          nftTokenId
          contract {
            address
            chainId
          }
        }
        ownedBy
      }
    }
  }
`;

export enum ProfileInterestsPrefix {
  ArtEntertainment = "ART_ENTERTAINMENT",
  Business = "BUSINESS",
  Technology = "TECHNOLOGY",
  Career = "CAREER",
  Education = "EDUCATION",
  FamilyPartners = "FAMILY_PARENTING",
  HealthFitness = "HEALTH_FITNESS",
  FoodDrink = "FOOD_DRINK",
  HobbiesInterests = "HOBBIES_INTERESTS",
  News = "NEWS",
  HomeGarden = "HOME_GARDEN",
  LawGovernmentPolitics = "LAW_GOVERNMENT_POLITICS",
  Crypto = "CRYPTO",
  Lens = "LENS",
  NSFW = "NSFW",
}
