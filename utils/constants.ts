import { PlatformType } from "./platform";
import { SocialPlatformMapping } from "./utils";

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
    key: PlatformType.twitter,
    label: "",
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
    label: "eth",
  },
  {
    key: PlatformType.farcaster,
    label: "eth",
    icon: SocialPlatformMapping(PlatformType.farcaster).icon,
  },
  {
    key: PlatformType.lens,
    label: "lens",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "crypto",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "dao",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "bitcoin",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "blockchain",
  },
  {
    key: PlatformType.space_id,
    label: "bnb",
  },
  {
    key: PlatformType.dotbit,
    label: "bit",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "nft",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "888",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "wallet",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "x",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "klever",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "zil",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "hi",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "kresus",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "polygon",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "anime",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "manga",
  },
  {
    key: PlatformType.unstoppableDomains,
    label: "binanceus",
  },
  // {
  //   key: "space_id",
  //   label: "arb",
  // },
];
