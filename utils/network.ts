export enum Network {
  ethereum = "ethereum",
  binance_smart_chain = "binance_smart_chain",
  base = "base",
  arbitrum = "arbitrum",
  polygon = "polygon",
  optimism = "optimism",
  fantom = "fantom",
  zksync_era = "zksync_era",
  avalanche = "avalanche",
  crossbell = "crossbell",
  farcaster = "farcaster",
  conflux = "conflux",
  aptos = "aptos",
  arweave = "arweave",
  celo = "celo",
  gnosis = "gnosis",
  scroll = "scroll",
  zora = "zora",
  mastodon = "mastodon",
  erc1577 = "erc1577"
}

export interface NetworkMetaData {
  key: string;
  icon: string;
  label: string;
  primaryColor: string;
  bgColor: string;
  scanPrefix: string;
}

export const NetworkData: { [key in Network]: NetworkMetaData } = {
  [Network.ethereum]: {
    key: Network.ethereum,
    icon: "icons/icon-ethereum.svg",
    label: "Ethereum",
    primaryColor: "#5298FF",
    bgColor: "#ebf3ff",
    scanPrefix: "https://etherscan.io/",
  },
  [Network.polygon]: {
    key: Network.polygon,
    icon: "icons/icon-polygon.svg",
    label: "Polygon",
    primaryColor: "#8465CB",
    bgColor: "#efeaf8",
    scanPrefix: "https://polygonscan.com/",
  },
  [Network.avalanche]: {
    key: Network.avalanche,
    icon: "icons/icon-avalanche.svg",
    label: "Avalanche",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://avascan.info/",
  },
  [Network.aptos]: {
    key: Network.aptos,
    icon: "",
    label: "Aptos",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://aptoscan.com/",
  },
  [Network.arbitrum]: {
    key: Network.arbitrum,
    icon: "icons/icon-arbitrum.svg",
    label: "Arbitrum",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://arbiscan.io/",
  },
  [Network.arweave]: {
    key: Network.arweave,
    icon: "icons/icon-arweave.svg",
    label: "Arweave",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://viewblock.io/arweave/",
  },
  [Network.binance_smart_chain]: {
    key: Network.binance_smart_chain,
    icon: "icons/icon-bsc.svg",
    label: "BNB Chain",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://bscscan.com/",
  },
  [Network.base]: {
    key: Network.base,
    icon: "icons/icon-base.svg",
    label: "Base",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://basescan.org/",
  },
  [Network.celo]: {
    key: Network.celo,
    icon: "icons/icon-celo.svg",
    label: "Celo",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://celoscan.io/",
  },
  [Network.conflux]: {
    key: Network.conflux,
    icon: "icons/icon-conflux.svg",
    label: "Conflux",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://www.confluxscan.io/",
  },
  [Network.crossbell]: {
    key: Network.crossbell,
    icon: "icons/icon-crossbell.svg",
    label: "Crossbell",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://scan.crossbell.io/",
  },
  [Network.fantom]: {
    key: Network.fantom,
    icon: "icons/icon-fantom.svg",
    label: "Fantom",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://ftmscan.com/",
  },
  [Network.farcaster]: {
    key: Network.farcaster,
    icon: "icons/icon-farcaster.svg",
    label: "Farcaster",
    primaryColor: "#8a63d2",
    bgColor: "#efeaf8",
    scanPrefix: "https://casterscan.com/",
  },
  [Network.optimism]: {
    key: Network.optimism,
    icon: "icons/icon-optimism.svg",
    label: "Optimism",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://optimistic.etherscan.io/",
  },
  [Network.zksync_era]: {
    key: Network.zksync_era,
    icon: "",
    label: "zkSync Era",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://explorer.zksync.io/",
  },
  [Network.gnosis]: {
    key: Network.gnosis,
    icon: "icons/icon-gnosis.svg",
    label: "Gnosis",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://gnosisscan.io/",
  },
  [Network.scroll]: {
    key: Network.scroll,
    icon: "icons/icon-scroll.svg",
    label: "Scroll",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://scrollscan.com/",
  },
  [Network.zora]: {
    key: Network.zora,
    icon: "icons/icon-zora.svg",
    label: "Zora",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "https://explorer.zora.energy/",
  },
  [Network.mastodon]: {
    key: Network.mastodon,
    icon: "icons/icon-mastodon.svg",
    label: "Mastodon",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "",
  },
  [Network.erc1577]: {
    key: Network.erc1577,
    icon: "",
    label: "ERC-1577",
    primaryColor: "",
    bgColor: "",
    scanPrefix: "",
  },
};

export const NetworkMapping = (network: Network) => {
  return (
    NetworkData[network] ?? {
      key: network,
      icon: "",
      label: network,
      primaryColor: "#000000",
      bgColor: "#000000",
    }
  );
};
