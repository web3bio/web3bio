"use client";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  metaMaskWallet,
  okxWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()]
);

const walletsOptions = {
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "",
};
const wallets = [
  okxWallet({ ...walletsOptions }),
  metaMaskWallet({ ...walletsOptions, shimDisconnect: true }),
  walletConnectWallet(walletsOptions),
  rainbowWallet(walletsOptions),
  safeWallet({
    ...walletsOptions,
    debug: false,
    allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
  }),
];

const connectors = connectorsForWallets([
  {
    groupName: "Supported Wallets",
    wallets,
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider locale="en-US" chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
