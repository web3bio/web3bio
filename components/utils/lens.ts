import { gql } from "@apollo/client";

export const GET_PROFILE_LENS = gql`
  query Profile($request: ProfileRequest!) {
    profile(request: $request) {
      id
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
        comments
        posts
        mirrors
        quotes
        publications
      }
      interests
    }
  }
`;

export const LensInterestsMapping = (key: ProfileInterestsPrefix) => {
  const interestsMap = {
    [ProfileInterestsPrefix.ArtEntertainment]: {
      [ProfileInterestsPrefix.ArtEntertainment]: {
        label: "Arts & Entertainment",
        color: "",
      },
      ["ART_ENTERTAINMENT__BOOKS"]: {
        label: "Books & Literature",
        color: "",
      },
      ["ART_ENTERTAINMENT__ART"]: {
        label: "Art",
        color: "",
      },
      ["ART_ENTERTAINMENT__DESIGN"]: {
        label: "Design",
        color: "",
      },
      ["ART_ENTERTAINMENT__PHOTOGRAPHY"]: {
        label: "Photography",
        color: "",
      },
      ["ART_ENTERTAINMENT__FASHION"]: {
        label: "Fashion",
        color: "",
      },
      ["ART_ENTERTAINMENT__ANIME"]: {
        label: "Anime",
        color: "",
      },
      ["ART_ENTERTAINMENT__MEMES"]: {
        label: "Memes",
        color: "",
      },
      ["ART_ENTERTAINMENT__FILM_TV"]: {
        label: "Film & TV",
        color: "",
      },
      ["ART_ENTERTAINMENT__MUSIC"]: {
        label: "Music",
        color: "",
      },
    },
    [ProfileInterestsPrefix.Business]: {
      [ProfileInterestsPrefix.Business]: {
        label: "Business",
        color: "",
      },
      ["BUSINESS__CREATOR_ECONOMY"]: {
        label: "Creator Economy",
        color: "",
      },
      ["BUSINESS__FINANCE"]: {
        label: "Finance",
        color: "",
      },
      ["BUSINESS__MARKETING"]: {
        label: "Marketing",
        color: "",
      },
    },
    [ProfileInterestsPrefix.Technology]: {
      [ProfileInterestsPrefix.Technology]: {
        label: "Technology",
      },
      ["TECHNOLOGY__AI_ML"]: {
        label: "AI & ML",
      },
      ["TECHNOLOGY__SCIENCE"]: {
        label: "Science",
      },
      ["TECHNOLOGY__PROGRAMMING"]: {
        label: "Programming",
      },
      ["TECHNOLOGY__TOOLS"]: {
        label: "Tools",
      },
      ["TECHNOLOGY__BIOTECH"]: {
        label: "Biotech",
      },
    },
    [ProfileInterestsPrefix.HealthFitness]: {
      [ProfileInterestsPrefix.HealthFitness]: {
        label: "Health & Fitness",
      },
      ["HEALTH_FITNESS__EXERCISE"]: {
        label: "Exercise",
      },
      ["HEALTH_FITNESS__BIOHACKING"]: {
        label: "Biohacking",
      },
    },
    [ProfileInterestsPrefix.FoodDrink]: {
      [ProfileInterestsPrefix.FoodDrink]: {
        label: "Food & Drink",
      },
      ["FOOD_DRINK__RESTAURANTS"]: {
        label: "Restaurants",
      },
      ["FOOD_DRINK__COOKING"]: {
        label: "Cooking",
      },
      ["FOOD_DRINK__COCKTAILS"]: {
        label: "Cocktails",
      },
      ["FOOD_DRINK__BEER"]: {
        label: "Beer",
      },
      ["FOOD_DRINK__WINE"]: {
        label: "Wine",
      },
    },
    [ProfileInterestsPrefix.HobbiesInterests]: {
      [ProfileInterestsPrefix.HobbiesInterests]: {
        label: "Hobbies & Interests",
      },
      ["HOBBIES_INTERESTS__ARTS_CRAFTS"]: {
        label: "Arts & Crafts",
      },
      ["HOBBIES_INTERESTS__GAMING"]: {
        label: "Gaming",
      },
      ["HOBBIES_INTERESTS__TRAVEL"]: {
        label: "Travel",
      },
      ["HOBBIES_INTERESTS__COLLECTING"]: {
        label: "Collecting",
      },
      ["HOBBIES_INTERESTS__SPORTS"]: {
        label: "Sports",
      },
      ["HOBBIES_INTERESTS__CARS"]: {
        label: "Cars",
      },
    },
    [ProfileInterestsPrefix.News]: {
      [ProfileInterestsPrefix.News]: {
        label: "News",
      },
    },
    [ProfileInterestsPrefix.FamilyPartners]: {
      [ProfileInterestsPrefix.FamilyPartners]: {
        label: "Family & Parenting",
      },
    },
    [ProfileInterestsPrefix.Education]: {
      [ProfileInterestsPrefix.Education]: {
        label: "Education",
      },
    },
    [ProfileInterestsPrefix.Career]: {
      [ProfileInterestsPrefix.Career]: {
        label: "Career",
      },
    },
    [ProfileInterestsPrefix.HomeGarden]: {
      [ProfileInterestsPrefix.HomeGarden]: {
        label: "Home & Garden",
      },
      ["HOME_GARDEN__NATURE"]: {
        label: "Nature",
      },
      ["HOME_GARDEN__ANIMALS"]: {
        label: "Animals",
      },
      ["HOME_GARDEN__HOMEIMPROVEMENT"]: {
        label: "Home Improvement",
      },
      ["HOME_GARDEN__GARDENING"]: {
        label: "Gardening",
      },
    },
    [ProfileInterestsPrefix.LawGovernmentPolitics]: {
      [ProfileInterestsPrefix.LawGovernmentPolitics]: {
        label: "Law, Government and Politics",
      },
      ["LAW_GOVERNMENT_POLITICS__REGULATION"]: {
        label: "Regulation",
      },
    },
    [ProfileInterestsPrefix.Crypto]: {
      [ProfileInterestsPrefix.Crypto]: {
        label: "Crypto",
      },
      ["CRYPTO__NFT"]: {
        label: "NFT",
      },
      ["CRYPTO__DEFI"]: {
        label: "DeFi",
      },
      ["CRYPTO__WEB3"]: {
        label: "Web3",
      },
      ["CRYPTO__WEB3_SOCIAL"]: {
        label: "Web3 Social",
      },
      ["CRYPTO__GOVERNANCE"]: {
        label: "Governance",
      },
      ["CRYPTO__DAOS"]: {
        label: "DAOs",
      },
      ["CRYPTO__GM"]: {
        label: "gm",
      },
      ["CRYPTO__METAVERSE"]: {
        label: "Metaverse",
      },
      ["CRYPTO__REKT"]: {
        label: "Rekt",
      },
      ["CRYPTO__ETHEREUM"]: {
        label: "Ethereum",
      },
      ["CRYPTO__BITCOIN"]: {
        label: "Bitcoin",
      },
      ["CRYPTO__L1"]: {
        label: "L1s",
      },
      ["CRYPTO__L2"]: {
        label: "L2s",
      },
      ["CRYPTO__SCALING"]: {
        label: "Scaling",
      },
    },
    [ProfileInterestsPrefix.Lens]: {
      [ProfileInterestsPrefix.Lens]: {
        label: "Lens",
      },
    },
    [ProfileInterestsPrefix.NSFW]: {
      [ProfileInterestsPrefix.NSFW]: {
        label: "NSFW",
      },
    },
  };

  const _key = key.split("__")[0];
  const item = interestsMap[_key]?.[key];
  return item;
};
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
export const enum LensParamType {
  domain = "domain",
  address = "address",
}

export const getLensProfileQuery = (type: LensParamType) => {
  const queryNamespace =
    type === LensParamType.address ? "defaultProfile" : "profile";
  const requestNamespace =
    type === LensParamType.address ? "DefaultProfileRequest" : "ProfileRequest";
  return `
  query Profile($request: ${requestNamespace}!) {
    ${queryNamespace}(request: $request) {
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
};


export const LensProtocolProfileCollectionAddress =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
export const LensGraphQLEndpoint = "https://api-v2.lens.dev/";