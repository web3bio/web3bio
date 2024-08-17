import {
  PlatformSystem,
  PlatformType,
  SocialPlatformMapping,
} from "./platform";
import {
  regexAvatar,
  regexBtc,
  regexCrossbell,
  regexDotbit,
  regexEns,
  regexEth,
  regexFarcaster,
  regexGenome,
  regexLens,
  regexSns,
  regexSolana,
  regexSpaceid,
  regexUnstoppableDomains,
} from "./regexp";
import { SearchListItemType } from "../search/SearchInput";

// Empty for Twitter and Farcaster
export const DefaultSearchSuffix = [
  {
    key: PlatformType.ens,
    label: "eth",
    system: PlatformSystem.web3,
  },
  {
    key: PlatformType.lens,
    label: "lens",
    system: PlatformSystem.web3,
  },
  {
    key: PlatformType.farcaster,
    label: "",
    optional: "eth",
    system: PlatformSystem.web3,
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "crypto",
    system: PlatformSystem.web3,
  },
  {
    key: PlatformType.twitter,
    system: PlatformSystem.web2,
  },
  {
    key: PlatformType.github,
    system: PlatformSystem.web2,
  },
  {
    key: PlatformType.clusters,
    system: PlatformSystem.web2,
  },
  {
    key: PlatformType.keybase,
    system: PlatformSystem.web2,
  },
  {
    key: PlatformType.reddit,
    system: PlatformSystem.web2,
  },
];

export const fuzzyDomainSuffix = [
  {
    key: PlatformType.ens,
    icon: SocialPlatformMapping(PlatformType.ens).icon,
    match: regexEns,
    suffixes: ["eth", "xyz", "app", "luxe", "kred", "art", "ceo", "club"],
  },
  {
    key: PlatformType.farcaster,
    icon: SocialPlatformMapping(PlatformType.farcaster).icon,
    match: regexFarcaster,
    suffixes: ["eth", "farcaster"],
  },
  {
    key: PlatformType.lens,
    icon: SocialPlatformMapping(PlatformType.lens).icon,
    match: regexLens,
    suffixes: ["lens"],
  },
  {
    key: PlatformType.dotbit,
    icon: SocialPlatformMapping(PlatformType.dotbit).icon,
    match: regexDotbit,
    suffixes: ["bit"],
  },
  {
    key: PlatformType.unstoppableDomains,
    icon: SocialPlatformMapping(PlatformType.unstoppableDomains).icon,
    match: regexUnstoppableDomains,
    suffixes: [
      "crypto",
      "888",
      "nft",
      "blockchain",
      "unstoppable",
      "bitcoin",
      "dao",
      "x",
      "klever",
      "hi",
      "zil",
      "kresus",
      "polygon",
      "wallet",
      "binanceus",
      "anime",
      "go",
      "manga",
      "eth",
      "altimist",
      "pudgy",
      "austin",
      "bitget",
      "pog",
      "clay",
      "witg",
      "metropolis",
      "wrkx",
      "secret",
      "com",
    ],
  },

  {
    key: PlatformType.space_id,
    icon: SocialPlatformMapping(PlatformType.space_id).icon,
    match: regexSpaceid,
    suffixes: ["bnb", "arb"],
  },

  {
    key: PlatformType.crossbell,
    icon: SocialPlatformMapping(PlatformType.crossbell).icon,
    match: regexCrossbell,
    suffixes: ["csb"],
  },
  {
    key: PlatformType.sns,
    icon: SocialPlatformMapping(PlatformType.sns).icon,
    match: regexSns,
    suffixes: ["sol"],
  },
  {
    key: PlatformType.genome,
    icon: SocialPlatformMapping(PlatformType.genome).icon,
    match: regexGenome,
    suffixes: ["gno"],
  },
  // ⬇️ Addresses
  {
    key: PlatformType.ethereum,
    icon: SocialPlatformMapping(PlatformType.ethereum).icon,
    match: regexEth,
    suffixes: null,
  },
  {
    key: PlatformType.bitcoin,
    icon: SocialPlatformMapping(PlatformType.bitcoin).icon,
    match: regexBtc,
    suffixes: null,
  },
  {
    key: PlatformType.solana,
    icon: SocialPlatformMapping(PlatformType.solana).icon,
    match: regexSolana,
    suffixes: null,
  },
  {
    key: PlatformType.nextid,
    icon: SocialPlatformMapping(PlatformType.nextid).icon,
    match: regexAvatar,
    suffixes: null,
  },
];

// Search suggestions for the search input
const matchQuery = (query: string, index = 0): string => {
  if (!query) return "";
  const splitChar = query.includes(".") ? "." : "。";
  return query.includes(splitChar) ? query.split(splitChar)[index] : query;
};

const isQuerySplit = (query: string): boolean => 
  query.includes(".") || query.includes("。");

export const getSearchSuggestions = (query: string): SearchListItemType[] => {
  if (query.includes("/")) {
    const platformClusters = SocialPlatformMapping(PlatformType.clusters);
    return [{
      key: PlatformType.clusters,
      icon: platformClusters.icon,
      label: query,
      system: PlatformSystem.web3,
    }];
  }

  const isLastDot = query[query.length - 1] === ".";
  const isAddress = fuzzyDomainSuffix.some(x => !x.suffixes && x.match.test(query));
  
  if (isAddress || (isQuerySplit(query) && !isLastDot)) {
    if (isLastDot) return [];

    const suffix = matchQuery(query, query.split(".").length - 1);
    return fuzzyDomainSuffix
      .filter(x => x.match.test(query) || (x.suffixes && x.suffixes.some(s => s.startsWith(suffix))))
      .flatMap(x => {
        if (x.suffixes && !isAddress) {
          const matchedSuffix = x.suffixes.find(i => i.startsWith(suffix));
          if (matchedSuffix) {
            return [{
              key: x.key,
              icon: x.icon,
              label: query.replace(`.${suffix}`, "") + "." + matchedSuffix,
              system: PlatformSystem.web3,
            }];
          }
        } else if (x.key !== PlatformType.farcaster) {
          return [{
            key: x.key,
            icon: x.icon,
            label: query,
            system: PlatformSystem.web3,
          }];
        }
        return [];
      });
  } else {
    return DefaultSearchSuffix
      .flatMap(value => {
        const label = query + (value.label ? `.${value.label}` : "");
        if (!isLastDot || (isLastDot && value.system === PlatformSystem.web3)) {
          return [{
            key: value.key,
            icon: SocialPlatformMapping(value.key).icon,
            label: isLastDot ? `${query}${value.label || value.optional || ''}` : label,
            system: value.system,
          }];
        }
        return [];
      });
  }
};