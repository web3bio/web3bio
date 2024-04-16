import { SearchListItemType } from "../components/search/SearchInput";
import { PlatformType } from "./platform";
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

const matchQuery = (query, index = 0) => {
  if (!query) return "";
  return query.includes(".")
    ? query.split(".")[index]
    : query.includes("。")
    ? query.split("。")[index]
    : query;
};
const isQuerySplit = (query: string) => {
  return query.includes(".") || query.includes("。");
};

export const getSearchSuggestions = (query) => {
  const isLastDot = [".", "。"].includes(query[query.length - 1]);
  // address or query.x
  if (
    fuzzyDomainSuffix
      .filter((x) => !x.suffixes)
      .some((x) => x.match.test(query)) ||
    (isQuerySplit(query) && !isLastDot)
  ) {
    if (isLastDot) return [];
    const suffix = matchQuery(query, 1);
    const backupDomains = fuzzyDomainSuffix
      .filter(
        (x) =>
          x.match.test(query.replace("。", ".")) ||
          x.suffixes?.some((i) => i.startsWith(suffix))
      )
      .map((x) => {
        if (
          x.suffixes &&
          !fuzzyDomainSuffix
            .filter((x) => !x.suffixes)
            .some((x) => x.match.test(query))
        ) {
          return {
            key: x.key,
            text:
              matchQuery(query) +
              "." +
              x.suffixes?.find((i) => i.startsWith(suffix)),
            icon: x.icon,
          };
        } else {
          if (x.key !== PlatformType.farcaster)
            return {
              key: x.key,
              text: query,
              icon: x.icon,
            };
        }
      });
    return backupDomains.reduce((pre, cur) => {
      if (cur?.key) {
        pre.push({
          key: cur.key,
          icon: cur?.icon,
          label: cur.text,
        });
      }
      return pre;
    }, new Array<SearchListItemType>());
  } else {
    return DefaultSearchSuffix.reduce((pre, cur) => {
      const label =
        matchQuery(query) + (cur.label.length > 0 ? `.${cur.label}` : "");
      if (isLastDot && cur.key === PlatformType.farcaster) {
        pre.push({
          key: cur.key,
          icon: SocialPlatformMapping(cur.key).icon,
          label: label + "." + cur.optional,
        });
      }
      if (!isLastDot || cur.label.length > 0) {
        pre.push({
          key: cur.key,
          icon: SocialPlatformMapping(cur.key).icon,
          label: label,
        });
      }

      return pre;
    }, new Array<SearchListItemType>());
  }
};
