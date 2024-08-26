// Constants
export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
export const profileAPIBaseURL =
  process.env.NEXT_PUBLIC_PROFILE_END_POINT || "https://api.web3.bio";
export const articleAPIBaseURL = "https://article-api.web3.bio";

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

  console.time(`${logName} ${url} API call`);

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

// API Fetchers
export const ArticlesFetcher = (url) =>
  customFetcher({ 
    url,
    logName: "Articles"
  });

export const DegenscoreFetcher = (url) =>
  customFetcher({ 
    url, 
    logName: "DegenScore" 
  });

export const FireflyFetcher = ([url, body]) =>
  customFetcher({ 
    url, 
    method: "POST", 
    body, 
    logName: "Firefly" 
  });

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
  customFetcher({ 
    url, 
    ...options, 
    logName: "Profile" 
  });

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
  customFetcher({ 
    url, 
    ...options, 
    logName: "SimpleHash" 
  });

export const TalentFetcher = (url) =>
  customFetcher({
    url,
    apiKeyHeader: "x-api-key",
    apiKeyValue: process.env.NEXT_PUBLIC_TALENT_API_KEY,
    logName: "Talent Protocol",
  });
