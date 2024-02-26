"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { disconnect } from "@wagmi/core";
import Clipboard from "react-clipboard.js";
import { useState } from "react";

export default function WalletButton(props) {
  const {} = props;
  const [isCopied, setIsCopied] = useState(false);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  return (
    <div className="wallet-btn">
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;

          return (
            <div>
              {(() => {
                if (!connected) {
                  return (
                    <div onClick={openConnectModal} className="connect-btn">
                      Connect Wallet
                    </div>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <div
                      onClick={openChainModal}
                      className="connect-btn wrong-network"
                    >
                      Wrong network
                    </div>
                  );
                }
                return (
                  <div className="wallet-container">
                    {chain.hasIcon && (
                      <div
                        className="connect-btn chain-container"
                        onClick={openChainModal}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            className={"chain-icon"}
                          />
                        )}
                        {chain.name}
                      </div>
                    )}

                    <div className="dropdown">
                      <div
                        className="connect-btn chain-container dropdown-toggle"
                        tabIndex={0}
                      >
                        <img
                          className="chain-icon"
                          src={
                            account.ensAvatar ||
                            process.env.NEXT_PUBLIC_PROFILE_END_POINT +
                              `/avatar/${account.ensName || account.address}`
                          }
                          alt={account.address}
                        />
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                        <SVG
                          src="../icons/icon-more.svg"
                          width={20}
                          height={20}
                          className="action"
                        />
                      </div>
                      <ul className="menu">
                        <Clipboard
                          component="div"
                          data-clipboard-text={account.address}
                          onSuccess={onCopySuccess}
                          title="Copy this wallet address"
                        >
                          <li className="menu-item dropdown-menu-item">
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                              href=""
                              target="_blank"
                            >
                              <SVG
                                src="../icons/icon-copy.svg"
                                width={20}
                                height={20}
                                className="action mr-1"
                              />
                              Copy Address
                            </Link>
                          </li>
                        </Clipboard>

                        <li className="menu-item dropdown-menu-item">
                          <Link
                            href={`https://debank.com/profile/${account.address}`}
                            target="_blank"
                          >
                            <SVG
                              src="../icons/icon-wallet.svg"
                              width={20}
                              height={20}
                              className="action mr-1"
                            />
                            View assets on DeBank
                          </Link>
                        </li>
                        <li className="menu-item dropdown-menu-item">
                          <Link
                            href="/"
                            onClick={async (e) => {
                              e.preventDefault();
                              await disconnect();
                            }}
                          >
                            <SVG
                              src="../icons/icon-close.svg"
                              width={20}
                              height={20}
                              className="action mr-1"
                            />
                            Disconnect
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })()}
              {isCopied && (
                <div className="web3bio-toast">
                  <div className="toast">
                    <SVG
                      src="../icons/icon-copy.svg"
                      width={24}
                      height={24}
                      className="action mr-2"
                    />
                    Copied to clipboard
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
