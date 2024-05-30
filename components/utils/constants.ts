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

// empty for twitter and farcaster
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
    key: PlatformType.linkedin,
    system: PlatformSystem.web2,
  },
  {
    key: PlatformType.reddit,
    system: PlatformSystem.web2,
  },
  {
    key: PlatformType.keybase,
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
export const ArweaveAssetPrefix = "https://arweave.net/";
