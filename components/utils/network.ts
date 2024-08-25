import { SIMPLEHASH_CHAINS } from "./api";

export enum Network {
  ethereum = "ethereum",
  bsc = "bsc",
  base = "base",
  arbitrum = "arbitrum",
  arbitrum_one = "arbitrum_one",
  arbitrum_nova = "arbitrum_nova",
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
  flow = "flow",
  gnosis = "gnosis",
  scroll = "scroll",
  zora = "zora",
  mastodon = "mastodon",
  lens = "lens",
  linea = "linea",
  snapshot = "snapshot",
  erc1577 = "erc1577",
  solana = "solana",
}

export interface NetworkMetaData {
  key: string;
  chainId?: number;
  icon: string;
  label: string;
  primaryColor: string;
  bgColor: string;
  scanPrefix: string;
  scanLabel?: string;
  short?: string;
}

export const NETWORK_DATA: { [key in Network]: NetworkMetaData } = {
  [Network.ethereum]: {
    key: Network.ethereum,
    chainId: 1,
    icon: "icons/icon-ethereum.svg",
    label: "Ethereum",
    primaryColor: "#3741ba",
    bgColor: "#ebecf8",
    scanPrefix: "https://etherscan.io/address/",
    scanLabel: "Etherscan.io",
    short: "eth",
  },
  [Network.polygon]: {
    key: Network.polygon,
    chainId: 137,
    icon: "icons/icon-polygon.svg",
    label: "Polygon",
    primaryColor: "#7a4add",
    bgColor: "#ece5fa",
    scanPrefix: "https://polygonscan.com/",
    short: "matic",
  },
  [Network.avalanche]: {
    key: Network.avalanche,
    chainId: 43114,
    icon: "icons/icon-avalanche.svg",
    label: "Avalanche",
    primaryColor: "#e84142",
    bgColor: "#ffefef",
    scanPrefix: "https://avascan.info/",
  },
  [Network.aptos]: {
    key: Network.aptos,
    icon: "icons/icon-aptos.svg",
    label: "Aptos",
    primaryColor: "#6fe0b2",
    bgColor: "#e9faf3",
    scanPrefix: "https://aptoscan.com/",
  },
  [Network.arbitrum]: {
    key: Network.arbitrum,
    chainId: 42161,
    icon: "icons/icon-arbitrum.svg",
    label: "Arbitrum",
    primaryColor: "#2949d4",
    bgColor: "#eaedfb",
    scanPrefix: "https://arbiscan.io/",
    short: "arb",
  },
  [Network.arbitrum_one]: {
    key: Network.arbitrum_one,
    chainId: 42161,
    icon: "icons/icon-arbitrum.svg",
    label: "Arbitrum One",
    primaryColor: "#2949d4",
    bgColor: "#eaedfb",
    scanPrefix: "https://arbiscan.io/",
    short: "arb",
  },
  [Network.arbitrum_nova]: {
    key: Network.arbitrum_nova,
    chainId: 42170,
    icon: "icons/icon-arbitrum.svg",
    label: "Arbitrum Nova",
    primaryColor: "#ee7c31",
    bgColor: "#fdf2ea",
    scanPrefix: "https://nova.arbiscan.io/",
    short: "arb",
  },
  [Network.arweave]: {
    key: Network.arweave,
    icon: "icons/icon-arweave.svg",
    label: "Arweave",
    primaryColor: "#222326",
    bgColor: "#e1e1e1",
    scanPrefix: "https://viewblock.io/arweave/",
  },
  [Network.bsc]: {
    key: Network.bsc,
    chainId: 56,
    icon: "icons/icon-bsc.svg",
    label: "BNB Chain",
    primaryColor: "#f0b90b",
    bgColor: "#fdf3d4",
    scanPrefix: "https://bscscan.com/",
    short: "bsc",
  },
  [Network.base]: {
    key: Network.base,
    chainId: 8453,
    icon: "icons/icon-base.svg",
    label: "Base",
    short: "base",
    primaryColor: "#2151f5",
    bgColor: "#e9eefe",
    scanPrefix: "https://basescan.org/",
  },
  [Network.flow]: {
    key: Network.flow,
    icon: "icons/icon-flow.svg",
    label: "Flow",
    primaryColor: "#00ef8b",
    bgColor: "#e5fdf3",
    scanPrefix: "https://www.flowdiver.io/",
  },
  [Network.conflux]: {
    key: Network.conflux,
    chainId: 1030,
    icon: "icons/icon-conflux.svg",
    label: "Conflux",
    primaryColor: "#1e1e2b",
    bgColor: "#e8e8ea",
    scanPrefix: "https://www.confluxscan.io/",
  },
  [Network.crossbell]: {
    key: Network.crossbell,
    chainId: 3737,
    icon: "icons/icon-crossbell.svg",
    label: "Crossbell",
    primaryColor: "#f7d16a",
    bgColor: "#fef8e9",
    scanPrefix: "https://scan.crossbell.io/",
  },
  [Network.fantom]: {
    key: Network.fantom,
    chainId: 250,
    icon: "icons/icon-fantom.svg",
    label: "Fantom",
    primaryColor: "#0810ef",
    bgColor: "#e6e7fd",
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
    short: "op",
    chainId: 10,
    icon: "icons/icon-optimism.svg",
    label: "Optimism",
    primaryColor: "#ea3431",
    bgColor: "#fdebea",
    scanPrefix: "https://optimistic.etherscan.io/",
  },
  [Network.zksync_era]: {
    key: Network.zksync_era,
    chainId: 324,
    icon: "icons/icon-zksync.svg",
    label: "zkSync Era",
    primaryColor: "#3567f6",
    bgColor: "#ebf0fe",
    scanPrefix: "https://explorer.zksync.io/",
  },
  [Network.gnosis]: {
    key: Network.gnosis,
    chainId: 100,
    icon: "icons/icon-gnosis.svg",
    label: "Gnosis",
    primaryColor: "#1c352a",
    bgColor: "#e8ebea",
    scanPrefix: "https://gnosisscan.io/",
  },
  [Network.scroll]: {
    key: Network.scroll,
    chainId: 534352,
    icon: "icons/icon-scroll.svg",
    label: "Scroll",
    primaryColor: "#b78544",
    bgColor: "#f1e7db",
    scanPrefix: "https://scrollscan.com/",
  },
  [Network.solana]: {
    key: Network.solana,
    chainId: 534352,
    primaryColor: "#9945FF",
    icon: "icons/icon-solana.svg",
    label: "Solana",
    bgColor: "#ffffff",
    scanPrefix: "https://solscan.io/account/",
    scanLabel: "Solscan.io",
  },
  [Network.zora]: {
    key: Network.zora,
    chainId: 7777777,
    icon: "icons/icon-zora.svg",
    label: "Zora",
    short: "zora",
    primaryColor: "#141414",
    bgColor: "#efefef",
    scanPrefix: "https://explorer.zora.energy/",
  },
  [Network.mastodon]: {
    key: Network.mastodon,
    icon: "icons/icon-mastodon.svg",
    label: "Mastodon",
    primaryColor: "#6364f6",
    bgColor: "#e8e8fe",
    scanPrefix: "",
  },
  [Network.lens]: {
    key: Network.lens,
    chainId: 137,
    icon: "icons/icon-lens.svg",
    label: "Lens",
    primaryColor: "#6bc674",
    bgColor: "#d9f1dc",
    scanPrefix: "https://momoka.lens.xyz/",
  },
  [Network.linea]: {
    key: Network.linea,
    icon: "icons/icon-linea.svg",
    label: "Linea",
    primaryColor: "#000000",
    bgColor: "#efefef",
    scanPrefix: "https://lineascan.build/",
  },
  [Network.snapshot]: {
    key: Network.snapshot,
    icon: "icons/icon-snapshot.svg",
    label: "Snapshot",
    primaryColor: "#f3b04e",
    bgColor: "#fef7ed",
    scanPrefix: "https://snapshot.org/",
  },
  [Network.erc1577]: {
    key: Network.erc1577,
    icon: "icons/icon-ethereum.svg",
    label: "ERC-1577",
    primaryColor: "#3741ba",
    bgColor: "#ebecf8",
    scanPrefix: "",
  },
};

export const NFTFilterMapping = {
  ["all"]: {
    label: "All Chains",
    filters: SIMPLEHASH_CHAINS,
  },
  ["ethereum"]: {
    label: "Ethereum",
    filters: "ethereum",
  },
  ["base"]: {
    label: "Base",
    filters: "base",
  },
  ["optimism"]: {
    label: "Optimism",
    filters: "optimism",
  },
  ["zora"]: {
    label: "Zora",
    filters: "zora",
  },
  ["polygon"]: {
    label: "Polygon",
    filters: "polygon",
  },
  ["arbitrum"]: {
    label: "Arbitrum",
    filters: "arbitrum",
  },
  ["bsc"]: {
    label: "BSC",
    filters: "bsc",
  },
  ["scroll"]: {
    label: "Scroll",
    filters: "scroll",
  },
  ["linea"]: {
    label: "Linea",
    filters: "linea",
  },
};

export const NetworksMap = new Map(
  Object.values(NETWORK_DATA).map((x) => [x.key, x])
);

export const networkByIdOrName = (id: number, name?: string) => {
  for (const [key, value] of NetworksMap) {
    if (value.chainId === id || [key, value.short].includes(name)) {
      return value;
    }
  }
  return null;
};

export const NetworkMapping = (network: Network) => {
  return (
    NetworksMap.get(network) ?? {
      key: network,
      icon: "",
      label: network,
      primaryColor: "#000000",
      bgColor: "#efefef",
      scanPrefix: "",
    }
  );
};

export const chainIdToNetwork = (
  chainId?: number | string,
  useShort?: boolean
) => {
  if (!chainId) return null;
  return (
    networkByIdOrName(Number(chainId))?.[useShort ? "short" : "key"] || null
  );
};
