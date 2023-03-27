import { PlatformType } from "./type";

type SocialPlatform = {
  key: string;
  color: string;
  icon: string;
  iconW: string;
  label: string;
  urlPrefix: string;
  ensText: string[];
};

export const SocialPlatformMapping: { [key in PlatformType]: SocialPlatform } =
  {
    [PlatformType.twitter]: {
      key: PlatformType.twitter,
      color: "#4A99E9",
      icon: "icons/icon-twitter.svg",
      iconW: "icons/icon-twitter-w.svg",
      label: "Twitter",
      urlPrefix: "https://twitter.com/",
      ensText: ["com.twitter", "vnd.twitter"],
    },
    [PlatformType.ens]: {
      key: PlatformType.ens,
      color: "#5298FF",
      icon: "icons/icon-ens.svg",
      iconW: "icons/icon-ens-w.svg",
      label: "ENS",
      urlPrefix: "https://app.ens.domains/search/",
      ensText: [],
    },
    [PlatformType.ethereum]: {
      key: PlatformType.ethereum,
      color: "#3c3c3d",
      icon: "icons/icon-ethereum.svg",
      iconW: "icons/icon-ethereum-w.svg",
      label: "Ethereum",
      urlPrefix: "https://etherscan.io/address/",
      ensText: [],
    },
    [PlatformType.farcaster]: {
      key: PlatformType.farcaster,
      color: "#8a63d2",
      icon: "icons/icon-farcaster.svg",
      iconW: "icons/icon-farcaster-w.svg",
      label: "Farcaster",
      urlPrefix: "https://warpcast.com/",
      ensText: [],
    },
    [PlatformType.github]: {
      key: PlatformType.github,
      color: "#4A99E9",
      icon: "icons/icon-github.svg",
      iconW: "icons/icon-github-w.svg",
      label: "Github",
      urlPrefix: "https://github.com/",
      ensText: ["com.github", "vnd.github"],
    },
    [PlatformType.keybase]: {
      key: PlatformType.keybase,
      color: "#4162E2",
      icon: "icons/icon-keybase.svg",
      iconW: "icons/icon-keybase-w.svg",
      label: "KeyBase",
      urlPrefix: "https://keybase.io/",
      ensText: [],
    },
    [PlatformType.lens]: {
      key: PlatformType.lens,
      color: "#BDFC5A",
      icon: "icons/icon-lens.svg",
      iconW: "icons/icon-lens-w.svg",
      label: "Lens",
      urlPrefix: "https://www.lensfrens.xyz/",
      ensText: [],
    },
    [PlatformType.nextid]: {
      key: PlatformType.nextid,
      color: "#121212",
      icon: "icons/icon-nextid.svg",
      iconW: "icons/icon-nextid-w.svg",
      label: "Next.ID",
      urlPrefix: "https://web5bio.com",
      ensText: [],
    },
    [PlatformType.reddit]: {
      key: PlatformType.reddit,
      color: "#EB5528",
      icon: "icons/icon-reddit.svg",
      iconW: "icons/icon-reddit-w.svg",
      label: "Reddit",
      urlPrefix: "https://www.reddit.com/user/",
      ensText: ["com.reddit"],
    },
    [PlatformType.space_id]: {
      key: PlatformType.space_id,
      color: "#71EBAA",
      icon: "icons/icon-spaceid.svg",
      iconW: "icons/icon-spaceid-w.svg",
      label: "SPACE ID",
      urlPrefix: "https://space.id/search?query=",
      ensText: [],
    },
    [PlatformType.unstoppableDomains]: {
      key: PlatformType.unstoppableDomains,
      color: "#71EBAA",
      icon: "icons/icon-unstoppabledomains.svg",
      iconW: "icons/icon-unstoppabledomains-w.svg",
      label: "Unstoppable Domains",
      ensText: [],
      urlPrefix: "https://unstoppabledomains.com/search?searchTerm=",
    },
    [PlatformType.telegram]: {
      key: PlatformType.telegram,
      // todo: color to add
      color: "#121212",
      icon: "icons/icon-telegram.svg",
      iconW: "icons/icon-telegram-w.svg",
      label: "Telegram",
      ensText: [],
      urlPrefix: "https://t.me/",
    },
    [PlatformType.instagram]: {
      key: PlatformType.instagram,
      // todo: color to add
      color: "#121212",
      icon: "icons/icon-instagram.svg",
      iconW: "icons/icon-instagram-w.svg",
      label: "Instagram",
      ensText: [],
      urlPrefix: "https://www.instagram.com/",
    },
    [PlatformType.dotbit]: {
      key: PlatformType.dotbit,
      color: "#0e7dff",
      icon: "icons/icon-dotbit.svg",
      iconW: "icons/icon-dotbit-w.svg",
      label: ".bit",
      ensText: [],
      urlPrefix: "https://data.did.id/",
    },
    [PlatformType.rss3]: {
      key: PlatformType.rss3,
      // todo: color to add
      color: "#121212",
      icon: "icons/icon-rss3.svg",
      iconW: "icons/icon-rss3-w.svg",
      label: "RSS3",
      ensText: [],
      urlPrefix: "https://rss3.io/",
    },
    [PlatformType.cyberconnect]: {
      key: PlatformType.cyberconnect,
      // todo: color to add
      color: "#121212",
      // todo: icons to add
      icon: "icons/icon-cyberconnect.svg",
      iconW: "icons/icon-cyberconnect-w.svg",
      label: "CyberConnect",
      ensText: [],
      urlPrefix: "https://link3.to/cyberconnect",
    },
    [PlatformType.opensea]: {
      key: PlatformType.cyberconnect,
      // todo: color to add
      color: "#121212",
      // todo: icons to add
      icon: "icons/icon-opensea.svg",
      iconW: "icons/icon-opensea-w.svg",
      label: "Opensea",
      ensText: [],
      urlPrefix: "https://opensea.io/",
    },
    [PlatformType.sybil]: {
      key: PlatformType.sybil,
      // todo: color to add
      color: "#121212",
      // todo: icons to add
      icon: "icons/icon-sybil.svg",
      iconW: "icons/icon-sybil-w.svg",
      label: "Sybil",
      ensText: [],
      urlPrefix: "http://sybil.com/",
    },
    [PlatformType.discord]: {
      key: PlatformType.discord,
      // todo: color to add
      color: "#121212",
      // todo: icons to add
      icon: "icons/icon-discord.svg",
      iconW: "icons/icon-discord-w.svg",
      label: "Discord",
      ensText: ["com.discord"],
      urlPrefix: "https://discord.gg/",
    },
    [PlatformType.unknown]: {
      key: PlatformType.unknown,
      color: "#121212",
      icon: "icons/icon-nextid.svg",
      iconW: "icons/icon-nextid-w.svg",
      label: "Unknown",
      ensText: [],
      urlPrefix: "https://web5bio.com",
    },
  };
