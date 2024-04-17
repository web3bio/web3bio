import { BigNumber } from "bignumber.js";
import { isIPFS_Resource, resolveIPFS_URL } from "./ipfs";
import { pow10 } from "./number";
import { PlatformType, PlatformData } from "./platform";
import { Network, NetworkData } from "./network";
import { ActivityType, ActivityTypeData } from "./activity";
import {
  regexDotbit,
  regexEns,
  regexEth,
  regexLens,
  regexCrossbell,
  regexTwitter,
  regexUnstoppableDomains,
  regexSpaceid,
  regexFarcaster,
  regexSolana,
  regexSns,
  regexBtc,
  regexAvatar,
} from "./regexp";
import _ from "lodash";
import {
  ArweaveAssetPrefix,
  DefaultSearchSuffix,
  fuzzyDomainSuffix,
} from "./constants";
import { SearchListItemType } from "../components/search/SearchInput";

export const formatText = (string, length?) => {
  if (!string) return "";
  const len = length ?? 12;
  const chars = len / 2 - 2;
  if (string.length <= len) {
    return string;
  }
  if (string.startsWith("0x")) {
    return `${string.substring(0, chars + 2)}...${string.substring(
      string.length - chars
    )}`;
  } else {
    if (string.length > len) {
      return `${string.substring(0, chars + 1)}...${string.substring(
        string.length - (chars + 1)
      )}`;
    }
  }
  return string;
};

export const formatValue = (value?: {
  value: string;
  decimals: number;
}): string => {
  if (!value) return "";
  return formatBalance(value.value, value.decimals, 5);
};

export function formatBalance(
  rawValue: BigNumber.Value = "0",
  decimals = 0,
  significant = decimals,
  isPrecise = false
) {
  let balance = new BigNumber(rawValue);
  if (balance.isNaN()) return "0";

  const base = pow10(decimals); // 10n ** decimals
  if (balance.div(base).lt(pow10(-6)) && balance.isGreaterThan(0) && !isPrecise)
    return "<0.000001";

  const negative = balance.isNegative(); // balance < 0n
  if (negative) balance = balance.absoluteValue(); // balance * -1n

  let fraction = balance.modulo(base).toString(10); // (balance % base).toString(10)

  // add leading zeros
  while (fraction.length < decimals) fraction = `0${fraction}`;

  // match significant digits
  const matchSignificantDigits = new RegExp(
    `^0*[1-9]\\d{0,${significant > 0 ? significant - 1 : 0}}`
  );
  fraction = fraction.match(matchSignificantDigits)?.[0] ?? "";

  // trim tailing zeros
  fraction = fraction.replace(/0+$/g, "");
  const whole = balance.dividedToIntegerBy(base).toString(10); // (balance / base).toString(10)
  const value = `${whole}${fraction === "" ? "" : `.${fraction}`}`;

  const raw = negative ? `-${value}` : value;
  return raw.includes(".") ? raw.replace(/0+$/, "").replace(/\.$/, "") : raw;
}

export function isSameAddress(
  address?: string | undefined,
  otherAddress?: string | undefined
): boolean {
  if (!address || !otherAddress) return false;
  return address.toLowerCase() === otherAddress.toLowerCase();
}

export function isWeb3Address(address: string): boolean {
  switch (!!address) {
    case regexEth.test(address):
    case regexCrossbell.test(address):
    case regexBtc.test(address):
    case regexSolana.test(address):
    case regexAvatar.test(address):
      return true;
    default:
      return false;
  }
}

export const handleSearchPlatform = (term: string) => {
  switch (!!term) {
    case regexEns.test(term):
      return PlatformType.ens;
    case regexEth.test(term):
      return PlatformType.ethereum;
    case regexLens.test(term):
      return PlatformType.lens;
    case regexUnstoppableDomains.test(term):
      return PlatformType.unstoppableDomains;
    case regexSpaceid.test(term):
      return PlatformType.space_id;
    case regexCrossbell.test(term):
      return PlatformType.crossbell;
    case regexDotbit.test(term):
      return PlatformType.dotbit;
    case regexSns.test(term):
      return PlatformType.sns;
    case regexBtc.test(term):
      return PlatformType.bitcoin;
    case regexSolana.test(term):
      return PlatformType.solana;
    case regexTwitter.test(term):
      return PlatformType.twitter;
    case regexFarcaster.test(term):
      return PlatformType.farcaster;
    default:
      return PlatformType.nextid;
  }
};

export const isValidEthereumAddress = (address: string) => {
  if (!regexEth.test(address)) return false; // invalid ethereum address
  if (address.match(/^0x0*.$|0x[123468abef]*$|0x0*dead$/i)) return false; // empty & burn address
  return true;
};

export const isDomainSearch = (term) => {
  return [
    PlatformType.ens,
    PlatformType.ethereum,
    PlatformType.dotbit,
    PlatformType.unstoppableDomains,
    PlatformType.space_id,
    PlatformType.solana,
  ].includes(term);
};

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export const resolveMediaURL = (url) => {
  if (!url) return null;

  switch (!!url) {
    case url.startsWith("data:") || url.startsWith("https:"):
      return url;
    case url.startsWith("ar://"):
      return url.replaceAll("ar://", ArweaveAssetPrefix);
    case isIPFS_Resource(url) || url.includes("ipfs:"):
      return resolveIPFS_URL(url);
    default:
      return url;
  }
};

export const SocialPlatformMapping = (platform: PlatformType) => {
  return (
    PlatformData[platform] ?? {
      key: platform,
      color: "#000000",
      icon: "",
      label: platform,
      ensText: [],
    }
  );
};

export const NetworkMapping = (network: Network) => {
  return (
    NetworkData[network] ?? {
      key: network,
      icon: "",
      label: network,
      primaryColor: "#000000",
      bgColor: "#efefef",
      scanPrefix: "",
    }
  );
};

export const ActivityTypeMapping = (type: ActivityType) => {
  return (
    ActivityTypeData[type] ?? {
      key: type,
      emoji: "",
      label: type,
      action: [],
      prep: "",
    }
  );
};

const resolveSocialMediaLink = (name: string, type: PlatformType) => {
  if (!Object.keys(PlatformType).includes(type))
    return `https://web3.bio/?s=${name}`;
  switch (type) {
    case PlatformType.url:
      return `${name}`;
    case PlatformType.dns:
    case PlatformType.website:
      return `https://${name}`;
    default:
      return SocialPlatformMapping(type).urlPrefix
        ? SocialPlatformMapping(type).urlPrefix + name
        : name;
  }
};

export const getSocialMediaLink = (url: string, type: PlatformType) => {
  let resolvedURL = "";
  if (!url) return null;
  if (url.startsWith("https")) {
    resolvedURL = url;
  } else {
    resolvedURL = resolveSocialMediaLink(url, type);
  }

  return resolvedURL;
};

export const fallbackEmoji = [
  "🤔",
  "😱",
  "😵‍💫",
  "😵",
  "🤦‍♀️",
  "💆‍♂️",
  "🤷‍♂️",
  "🙇‍♂️",
  "🤖",
];

export const colorMod = (hex, opacity = 100) => {
  const tempHex = hex.replace("#", "");
  const r = parseInt(tempHex.substring(0, 2), 16);
  const g = parseInt(tempHex.substring(2, 4), 16);
  const b = parseInt(tempHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

export const getScanLink = (address: string) => {
  if (!address) return "";
  const prefixArr = [
    {
      key: "ethereum.",
      url: "https://etherscan.io/address/",
    },
    {
      key: "polygon.",
      url: "https://polygonscan.com/address/",
    },
  ];
  let resolvedAddress = address;
  let url = prefixArr[0].url;
  prefixArr.forEach((x) => {
    if (address.includes(x.key)) {
      if (x.key === "polygon.") url = prefixArr[1].url;
      resolvedAddress = address.replaceAll(x.key, "");
    }
  });
  const res = url + resolvedAddress;
  return res;
};

export const getUniqueUniversalProfileLinks = (array) => {
  return array.filter(
    (obj, index, self) =>
      index ===
      self.findIndex(
        (t) => t.handle === obj.handle && t.platform === obj.platform
      )
  );
};

export const mapLinks = (data) => {
  const arr = getUniqueUniversalProfileLinks(
    data.reduce((pre, cur) => {
      const linksArr = Object.entries(cur?.links || {});
      if (linksArr) {
        linksArr.map(([key, value]) => {
          pre.push({
            platform: key,
            ...(value as { link: string; handle: string }),
          });
        });
      }
      return pre;
    }, [])
  );
  return _.uniqBy(arr, (x) => x.handle?.toLowerCase() && x.platform);
};

export const isValidURL = (str) => {
  try {
    return !!new URL(str);
  } catch (e) {
    return false;
  }
};

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

export const shouldPlatformFetch = (platform?: PlatformType | null) => {
  if (!platform) return false;
  if (
    [
      PlatformType.ens,
      PlatformType.ethereum,
      PlatformType.farcaster,
      PlatformType.lens,
      PlatformType.unstoppableDomains,
      PlatformType.dotbit,
      PlatformType.nextid,
      PlatformType.solana,
      PlatformType.sns,
    ].includes(platform)
  )
    return true;
  return false;
};