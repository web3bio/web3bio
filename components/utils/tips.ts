import { Network, NetworkMapping } from "./network";

type TokensMappingProps = {
  [index: string]: {
    symbol: string;
    address: `0x${string}` | null;
    chainId: number | undefined;
    decimals: 18;
    icon: string;
    isNativeToken: boolean;
  }[];
};
export const tipsTokenMapping: TokensMappingProps = {
  [Network.polygon]: [
    {
      symbol: "Matic",
      chainId: NetworkMapping(Network.polygon).chainId,
      address: null,
      decimals: 18,
      icon: "https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745",
      isNativeToken: true,
    },
    {
      symbol: "Bonsai",
      chainId: NetworkMapping(Network.polygon).chainId,
      address: "0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c",
      decimals: 18,
      icon: "https://assets.coingecko.com/coins/images/35884/standard/Bonsai_BW_Coingecko-200x200.jpg?1710071621",
      isNativeToken: false,
    },
  ],
  [Network.ethereum]: [
    {
      symbol: "ETH",
      chainId: NetworkMapping(Network.polygon).chainId,
      address: null,
      decimals: 18,
      icon: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
      isNativeToken: true,
    },
    {
      symbol: "Mask",
      chainId: NetworkMapping(Network.polygon).chainId,
      address: "0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074",
      decimals: 18,
      icon: "https://assets.coingecko.com/coins/images/14051/standard/Mask_Network.jpg?1696513776",
      isNativeToken: false,
    },
  ],
};
