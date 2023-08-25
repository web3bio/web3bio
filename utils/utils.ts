import { BigNumber } from "bignumber.js";
import { _fetcher } from "../components/apis/ens";
import { resolveIPFS_URL } from "./ipfs";
import { pow10 } from "./number";
import { PlatformType } from "./platform";
import {
  regexDotbit,
  regexEns,
  regexEth,
  regexLens,
  regexTwitter,
  regexUnstoppableDomains,
  regexSpaceid,
  regexFarcaster,
} from "./regexp";
import _ from "lodash";

const ArweaveAssetPrefix = "https://arweave.net/";

export const formatText = (string, length?) => {
  if (!string) return "";
  const len = length ?? 12;
  if (string.length <= len) {
    return string;
  }
  if (string.startsWith("0x")) {
    const oriAddr = string,
      chars = length || 4;
    return `${oriAddr.substring(0, chars + 2)}...${oriAddr.substring(
      oriAddr.length - chars
    )}`;
  } else {
    if (string.length > len) {
      return `${string.substr(0, len)}...`;
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

export const handleSearchPlatform = (term: string) => {
  switch (true) {
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
    case regexDotbit.test(term):
      return PlatformType.dotbit;
    case regexTwitter.test(term):
      return PlatformType.twitter;
    case regexFarcaster.test(term):
      return PlatformType.farcaster;
    default:
      return PlatformType.nextid;
  }
};

export const isDomainSearch = (term) => {
  return [
    PlatformType.ens,
    PlatformType.dotbit,
    PlatformType.unstoppableDomains,
    PlatformType.space_id,
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
  return url.startsWith("data:") || url.startsWith("https:")
    ? url
    : url.startsWith("ar://")
    ? url.replaceAll("ar://", ArweaveAssetPrefix)
    : resolveIPFS_URL(url);
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
