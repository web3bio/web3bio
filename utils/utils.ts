import { BigNumber } from "bignumber.js";
import { pow10 } from "./number";
import { PlatformType } from "./type";
import { EthereumAddress } from "wallet.ts";
import {
  regexDotbit,
  regexEns,
  regexEth,
  regexLens,
  regexTwitter,
  regUnstoppableDomains,
} from "./regexp";
import { getContractSpecImage } from "./ens";
import { resolveIPFS_URL } from "./ipfs";
export const formatText = (string, length?) => {
  const len = length ?? 12;
  if (string.length <= len) {
    return string;
  }
  if (string.startsWith("0x")) {
    const oriAddr = string,
      chars = 4;
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

export function getEnumAsArray<T extends object>(enumObject: T) {
  return (
    Object.keys(enumObject)
      // Leave only key of enum
      .filter((x) => Number.isNaN(Number.parseInt(x)))
      .map((key) => ({ key, value: enumObject[key as keyof T] }))
  );
}

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

export function resolveSocialMediaLink(name, type) {
  switch (type) {
    case "url":
      return `${name}`;
    case "website":
      return `https://${name}`;
    case "github":
      return `https://github.com/${name}`;
    case "twitter":
      return `https://twitter.com/${name}`;
    case "telegram":
      return `https://t.me/${name}`;
    case "reddit":
      return `https://www.reddit.com/user/${name}`;
    case "discord":
      return `https://discord.gg/${name}`;
    case "instagram":
      return `https://instagram.com/${name}`;
    default:
      return `https://web5.bio/?s=${name}`;
  }
}

export function isValidJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const handleSearchPlatform = (term: string) => {
  switch (true) {
    case regexEns.test(term):
      return PlatformType.ens;
    case regexLens.test(term):
      return PlatformType.lens;
    case regexDotbit.test(term):
      return PlatformType.dotbit;
    case regexEth.test(term):
      return PlatformType.ethereum;
    case regUnstoppableDomains.test(term):
      return PlatformType.unstoppableDomains;
    case regexTwitter.test(term):
      return PlatformType.twitter;
    default:
      return PlatformType.nextid;
  }
};

export const isDomainSearch = (term) => {
  return [
    PlatformType.ens,
    PlatformType.dotbit,
    PlatformType.unstoppableDomains,
  ].includes(term);
};

export const throttle = (fun, delay) => {
  let last, deferTimer;
  return function (args) {
    let that = this;
    let _args = arguments;
    let now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fun.apply(that, _args);
      }, delay);
    } else {
      last = now;
      fun.apply(that, _args);
    }
  };
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

export function isValidAddress(address?: string) {
  if (!address) return false;
  return EthereumAddress.isValid(address);
}

export const resolveMediaURL = (asset) => {
  const eipPrefix = "eip155:1/erc721:";
  if (asset) {
    if (asset.startsWith(eipPrefix)) {
      return getContractSpecImage(asset.split(eipPrefix)[1].split("/"));
    }
    return asset.startsWith("data:", "https:") ? asset : resolveIPFS_URL(asset);
  }
  return "";
};
