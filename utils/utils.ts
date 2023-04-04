import { BigNumber } from "bignumber.js";
import { EthereumAddress } from "wallet.ts";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT,
} from "../components/apis/nftscan";
import { resolveIPFS_URL } from "./ipfs";
import { pow10 } from "./number";
import { SocialPlatformMapping } from "./platform";
import {
  regexDotbit,
  regexEns,
  regexEth,
  regexLens,
  regexTwitter,
  regexUnstoppableDomains,
  regexSpaceid,
} from "./regexp";
import { PlatformType } from "./type";
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
  if (!Object.keys(PlatformType).includes(type))
    return `https://web5.bio/?s=${name}`;
  switch (type) {
    case PlatformType.url:
      return `${name}`;
    case PlatformType.website:
      return `https://${name}`;
    default:
      return SocialPlatformMapping(type).urlPrefix + name;
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
    case regexUnstoppableDomains.test(term):
      return PlatformType.unstoppableDomains;
    case regexSpaceid.test(term):
      return PlatformType.space_id;
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
    PlatformType.space_id,
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
  if (!asset) return null;
  return asset.startsWith("data:", "https:") ? asset : resolveIPFS_URL(asset);
};

export const resolveEipAssetURL = async (asset) => {
  if (!asset) return null;
  const eipPrefix = "eip155:1/erc721:";
  if (asset.startsWith(eipPrefix)) {
    const arr = asset.split(eipPrefix)[1].split("/");
    const url =
      NFTSCAN_BASE_API_ENDPOINT +
      `assets/${arr[0]}/${arr[1]}?show_attribute=false`;
    const res = await NFTSCANFetcher(url);
    if (res && res.data) {
      return resolveMediaURL(res.data.image_uri || res.data.content_uri);
    }
  }
  return resolveMediaURL(asset);
};

export const resolveHandle = (handle: string) => {
  const prefixHttps = "https://";
  const prefixHttp = "http://";
  if (
    handle &&
    (handle.startsWith(prefixHttp) || handle.startsWith(prefixHttps))
  ) {
    return handle
      .replaceAll(prefixHttp, "")
      .replaceAll(prefixHttps, "")
      .replaceAll("@", "");
  }
  return handle;
};

export const firstParam = (param: string | string[]) => {
  return Array.isArray(param) ? param[0] : param;
};

export const getSocialMediaLink = (url: string, type: string) => {
  let resolvedURL = "";
  if (!url) return null;
  if (url.startsWith("https")) {
    resolvedURL = url;
  } else {
    resolvedURL = resolveSocialMediaLink(url, type);
  }

  return resolvedURL;
};
