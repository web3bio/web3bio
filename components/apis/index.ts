import { gql } from "@apollo/client";

// Constants
export const AIRSTACK_GRAPHQL_ENDPOINT = "https://api.airstack.xyz/gql";
export const DEGENSCORE_ENDPOINT = "https://beacon.degenscore.com/v2/beacon/";
export const FIREFLY_ENDPOINT = "https://api.firefly.land";
export const FIREFLY_PROXY_DEBANK_ENDPOINT = "https://debank-proxy.r2d2.to";
export const GUILD_XYZ_ENDPOINT = "https://api.guild.xyz/v2";
export const PHI_GRAPHQL_END_POINT = "https://graph-api.phi.blue/graphql";
export const POAP_ENDPOINT = "https://api.poap.tech/actions/scan/";
export const POAP_TOKEN_ENDPOINT = "https://api.poap.tech/token/";
export const RSS3_ENDPOINT = "https://gi.rss3.io";

export const SIMPLEHASH_URL = "https://simplehash-proxy.r2d2.to";
export const SIMPLEHASH_CHAINS =
  "ethereum,polygon,base,bsc,arbitrum,scroll,linea,optimism,zora,solana";
export const SIMPLEHASH_PAGE_SIZE = 40;

export const SNAPSHOT_GRAPHQL_ENDPOINT = "https://hub.snapshot.org/graphql";
export const TALENT_API_ENDPOINT = "https://api.talentprotocol.com/api/v2/";
export const TALLY_GRAPHQL_ENDPOINT = "https://api.tally.xyz/query";
export const WEBACY_API_ENDPOINT = "https://api.webacy.com";

// GraphQL Queries
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

export const QUERY_PHILAND_INFO = gql`
  query QUERY_PHILAND_LIST($name: String!) {
    philandImage(input: { name: $name, transparent: true }) {
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
        proposalsCount
        verified
      }
      created
    }
  }
`;

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
        ... on Delegation {
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
`;

// Unified fetcher function
export const customFetcher = async (config) => {
  const {
    url,
    method = "GET",
    headers = {},
    body,
    apiKeyHeader,
    apiKeyValue,
    revalidate = 86400,
    logName,
  } = config;

  console.time(`${logName} API call`);

  try {
    const options = {
      method,
      headers: {
        ...headers,
      },
      next: { revalidate },
    };

    if (apiKeyHeader && apiKeyValue) {
      options.headers[apiKeyHeader] = apiKeyValue;
    }

    if (body) {
      (options as any).body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.timeEnd(`${logName} API call`);
    return data;
  } catch (error) {
    console.error(`Error in ${logName} API call:`, error);
    return [];
  }
};

// Example usage for different APIs
export const ArticlesFetcher = (url) =>
  customFetcher({ url, logName: "Articles" });
export const DegenFetcher = (url) =>
  customFetcher({ url, logName: "DegenScore" });
export const FireflyFetcher = ([url, body]) =>
  customFetcher({ url, method: "POST", body, logName: "Firefly" });
export const GuildFetcher = (url) =>
  customFetcher({
    url,
    headers: { accept: "application/json" },
    logName: "Guild",
  });
export const POAPFetcher = (url) =>
  customFetcher({
    url,
    headers: { accept: "application/json" },
    apiKeyHeader: "x-api-key",
    apiKeyValue: process.env.NEXT_PUBLIC_POAP_API_KEY,
    logName: "POAP",
  });
export const ProfileFetcher = (url, options?) =>
  customFetcher({ url, ...options, logName: "Profile" });
export const RSS3Fetcher = ([url, data]) =>
  customFetcher({
    url,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: data,
    logName: "RSS3",
  });
export const SimplehashFetcher = (url, options?) =>
  customFetcher({ url, ...options, logName: "SimpleHash" });
export const talentFetcher = (url) =>
  customFetcher({
    url,
    apiKeyHeader: "x-api-key",
    apiKeyValue: process.env.NEXT_PUBLIC_TALENT_API_KEY,
    logName: "Talent Protocol",
  });
