"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  zerionWallet,
  okxWallet,
  imTokenWallet,
  binanceWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const config = getDefaultConfig({
  appName: "Web3.bio",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "",
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  wallets: [
    {
      groupName: "Recommend",
      wallets: [
        zerionWallet,
        metaMaskWallet,
        okxWallet,
        coinbaseWallet,
        rainbowWallet,
        imTokenWallet,
        binanceWallet,
        walletConnectWallet,
        trustWallet,
      ],
    },
  ],
});

const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" locale="en-US">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
