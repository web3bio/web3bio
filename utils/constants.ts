import { PlatformType, SocialPlatformMapping } from "./platform";
import {
  regexBtc,
  regexCrossbell,
  regexDotbit,
  regexEns,
  regexEth,
  regexFarcaster,
  regexLens,
  regexSns,
  regexSolana,
  regexSpaceid,
  regexUnstoppableDomains,
} from "./regexp";

export const DefaultWeb2SearchSuffix = [
  PlatformType.twitter,
  PlatformType.github,
  PlatformType.linkedin,
  PlatformType.keybase,
  PlatformType.reddit,
];

// empty for twitter and farcaster
export const DefaultSearchSuffix = [
  {
    key: PlatformType.ens,
    label: "eth",
  },
  {
    key: PlatformType.lens,
    label: "lens",
  },
  {
    key: PlatformType.farcaster,
    label: "",
    optional: "eth",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "crypto",
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
];
export const ArweaveAssetPrefix = "https://arweave.net/";
