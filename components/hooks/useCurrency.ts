import { useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
export const useCurrencyAllowance = async ({ owner, tokenAddress }) => {
  const result = useReadContract({
    erc20Abi,
    address: owner,
    functionName: "allowance",
    args: [owner, tokenAddress],
  });
};

export const useCurrencyBalance = async ({ owner, tokenAddress }) => {
  return useBalance({
    address: owner,
    token: tokenAddress,
  });
};
