import { Network, NetworkMapping } from "./network";

type TokensMappingProps = {
  [index: string]: {
    symbol: string;
    address: `0x${string}` | null;
    chainId: number | undefined;
    decimals: 18;
    isNativeToken: boolean;
  };
};
export const tipsTokenMapping: TokensMappingProps = {
  [Network.polygon]: {
    symbol: "Matic",
    chainId: NetworkMapping(Network.polygon).chainId,
    address: null,
    decimals: 18,
    isNativeToken: true,
  },
  [Network.ethereum]: {
    symbol: "ETH",
    chainId: NetworkMapping(Network.polygon).chainId,
    address: null,
    decimals: 18,
    isNativeToken: true,
  },
};
