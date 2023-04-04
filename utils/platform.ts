import { PlatformType } from "./type";

type SocialPlatform = {
  key: string;
  color: string;
  icon?: string;
  iconW?: string;
  label: string;
  urlPrefix?: string;
  ensText?: string[];
};

export const SocialPlatformMapping = (platform: PlatformType) => {
  switch (platform) {
    case PlatformType.twitter:
      return {
        key: PlatformType.twitter,
        color: "#4A99E9",
        icon: "icons/icon-twitter.svg",
        iconW: "icons/icon-twitter-w.svg",
        label: "Twitter",
        urlPrefix: "https://twitter.com/",
        ensText: ["com.twitter", "vnd.twitter"],
      };
    case PlatformType.ens:
      return {
        key: PlatformType.ens,
        color: "#5298FF",
        // TODO: add ens search icon here
        icon: "icons/icon-ethereum.svg",
        iconW: "icons/icon-ens-w.svg",
        label: "ENS",
        urlPrefix: "https://app.ens.domains/search/",
        ensText: [],
      };
    case PlatformType.ethereum:
      return {
        key: PlatformType.ethereum,
        color: "#3c3c3d",
        icon: "icons/icon-ethereum.svg",
        iconW: "icons/icon-ethereum-w.svg",
        label: "Ethereum",
        urlPrefix: "https://etherscan.io/address/",
        ensText: [],
      };
    case PlatformType.farcaster:
      return {
        key: PlatformType.farcaster,
        color: "#8a63d2",
        icon: "icons/icon-farcaster.svg",
        iconW: "icons/icon-farcaster-w.svg",
        label: "Farcaster",
        urlPrefix: "https://warpcast.com/",
        ensText: [],
      };
    case PlatformType.github:
      return {
        key: PlatformType.github,
        color: "#000000",
        icon: "icons/icon-github.svg",
        iconW: "icons/icon-github-w.svg",
        label: "Github",
        urlPrefix: "https://github.com/",
        ensText: ["com.github", "vnd.github"],
      };
    case PlatformType.keybase:
      return {
        key: PlatformType.keybase,
        color: "#4162E2",
        icon: "icons/icon-keybase.svg",
        iconW: "icons/icon-keybase-w.svg",
        label: "Keybase",
        urlPrefix: "https://keybase.io/",
        ensText: [],
      };
    case PlatformType.lens:
      return {
        key: PlatformType.lens,
        color: "#BDFC5A",
        icon: "icons/icon-lens.svg",
        iconW: "icons/icon-lens-w.svg",
        label: "Lens",
        urlPrefix: "https://www.lensfrens.xyz/",
        ensText: [],
      };
    case PlatformType.nextid:
      return {
        key: PlatformType.nextid,
        color: "#121212",
        icon: "icons/icon-nextid.svg",
        iconW: "icons/icon-nextid-w.svg",
        label: "Next.ID",
        urlPrefix: "https://web5.bio",
        ensText: [],
      };
    case PlatformType.reddit:
      return {
        key: PlatformType.reddit,
        color: "#ff4500",
        icon: "icons/icon-reddit.svg",
        iconW: "icons/icon-reddit-w.svg",
        label: "Reddit",
        urlPrefix: "https://www.reddit.com/user/",
        ensText: ["com.reddit"],
      };
    case PlatformType.space_id:
      return {
        key: PlatformType.space_id,
        color: "#71EBAA",
        icon: "icons/icon-spaceid.svg",
        iconW: "icons/icon-spaceid-w.svg",
        label: "SPACE ID",
        urlPrefix: "https://space.id/search?query=",
        ensText: [],
      };
    case PlatformType.unstoppableDomains:
      return {
        key: PlatformType.unstoppableDomains,
        color: "#2E65F5",
        icon: "icons/icon-unstoppabledomains.svg",
        iconW: "icons/icon-unstoppabledomains-w.svg",
        label: "Unstoppable Domains",
        ensText: [],
        urlPrefix: "https://unstoppabledomains.com/search?searchTerm=",
      };
    case PlatformType.telegram:
      return {
        key: PlatformType.telegram,
        color: "#0088cc",
        icon: "icons/icon-telegram.svg",
        iconW: "icons/icon-telegram-w.svg",
        label: "Telegram",
        ensText: ["org.telegram", "vnd.telegram", "VND.TELEGRAM"],
        urlPrefix: "https://t.me/",
      };
    case PlatformType.instagram:
      return {
        key: PlatformType.instagram,
        color: "#EA3377",
        icon: "icons/icon-instagram.svg",
        iconW: "icons/icon-instagram-w.svg",
        label: "Instagram",
        ensText: ["com.instagram"],
        urlPrefix: "https://www.instagram.com/",
      };
    case PlatformType.dotbit:
      return {
        key: PlatformType.dotbit,
        color: "#0e7dff",
        icon: "icons/icon-dotbit.svg",
        iconW: "icons/icon-dotbit-w.svg",
        label: ".bit",
        ensText: [],
        urlPrefix: "https://data.did.id/",
      };
    case PlatformType.rss3:
      return {
        key: PlatformType.rss3,
        color: "#3070F6",
        // TODO: icons to add
        icon: "icons/icon-rss3.svg",
        iconW: "icons/icon-rss3-w.svg",
        label: "RSS3",
        ensText: [],
        urlPrefix: "https://rss3.io/",
      };
    case PlatformType.cyberconnect:
      return {
        key: PlatformType.cyberconnect,
        color: "#000000",
        // TODO: icons to add
        icon: "icons/icon-cyberconnect.svg",
        iconW: "icons/icon-cyberconnect-w.svg",
        label: "CyberConnect",
        ensText: [],
      };
    case PlatformType.opensea:
      return {
        key: PlatformType.cyberconnect,
        color: "#407FDB",
        icon: "icons/icon-opensea.svg",
        iconW: "icons/icon-opensea.svg",
        label: "Opensea",
        ensText: [],
        urlPrefix: "https://opensea.io/",
      };
    case PlatformType.sybil:
      return {
        key: PlatformType.sybil,
        color: "#4125E1",
        // TODO: icons to add
        icon: "icons/icon-sybil.svg",
        iconW: "icons/icon-sybil-w.svg",
        label: "Sybil",
        ensText: [],
        urlPrefix: "https://sybil.org/",
      };
    case PlatformType.discord:
      return {
        key: PlatformType.discord,
        color: "#5865f2",
        icon: "icons/icon-discord.svg",
        iconW: "icons/icon-discord-w.svg",
        label: "Discord",
        ensText: ["com.discord"],
        urlPrefix: "https://discord.com/",
      };
    case PlatformType.url:
      return {
        key: PlatformType.url,
        color: "#121212",
        label: "Unknown",
        ensText: ["url"],
      };
    case PlatformType.website:
      return {
        key: PlatformType.website,
        color: "#121212",
        label: "Unknown",
        ensText: [],
      };
    case PlatformType.linkedin:
      return {
        key: PlatformType.linkedin,
        color: "#195DB4",
        label: "LinkedIn",
        icon: "ioncs/social-linkedin.svg",
        ensText: ["com.linkedin"],
        urlPrefix: "https://www.linkedin.com/in/",
      };
    default:
      return {
        key: PlatformType.unknown,
        color: "#121212",
        icon: "icons/icon-nextid.svg",
        iconW: "icons/icon-nextid-w.svg",
        label: "Unknown",
        ensText: [],
      };
  }
};
