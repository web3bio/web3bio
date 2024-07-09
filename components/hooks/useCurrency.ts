import { useAccount, useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
export const useCurrencyAllowance = (tokenAddress?: `0x${string}`) => {
  const { address: owner } = useAccount();
  const { data, isPending, status } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [owner!, tokenAddress!],
  });

  return {
    data: data,
    isLoading: isPending,
    status: status,
  };
};

export const useCurrencyBalance = (tokenAddress?: `0x${string}`) => {
  const { address: owner } = useAccount();
  return useBalance({
    address: owner,
    token: tokenAddress || undefined,
  });
};
