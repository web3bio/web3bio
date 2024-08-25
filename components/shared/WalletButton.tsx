"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { disconnect } from "@wagmi/core";
import Clipboard from "react-clipboard.js";
import { useEffect, useRef, useState } from "react";
import { Loading } from "./Loading";
import { config } from "./WalletProvider";
import { profileAPIBaseURL } from "../utils/api";

export default function WalletButton(props) {
  const {} = props;
  const [isCopied, setIsCopied] = useState(false);
  const [show, setShow] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const avatar = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (avatar?.current) {
      if (avatarLoading) {
        if (avatar.current.complete) setAvatarLoading(false);
        avatar.current.onload = () => {
          setAvatarLoading(false);
        };
      }
    }
    const onKeyDown = (e) => {
      // cmd/ctrl + i
      if ((e.ctrlKey && e.keyCode === 73) || (e.metaKey && e.keyCode === 73)) {
        if (!show) {
          setShow(true);
        }
      }
    };
    document.body.addEventListener("keydown", onKeyDown);
    return () => document.body.removeEventListener("keydown", onKeyDown);
  }, [show, avatar?.current]);

  return (
    <div
      className="wallet-btn"
      style={{
        opacity: show ? 1 : 0,
      }}
    >
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;

          return (
            <div>
              {(() => {
                if (!connected) {
                  return (
                    <div
                      onClick={openConnectModal}
                      className="btn btn-primary connect-btn"
                    >
                      Connect Wallet
                    </div>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <div
                      onClick={openChainModal}
                      className="connect-btn btn btn-primary wrong-network"
                    >
                      Wrong network
                    </div>
                  );
                }
                return (
                  <div className="wallet-container">
                    {chain.hasIcon && (
                      <div
                        className="connect-btn btn btn-primary chain-container"
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
                        <div
                          className="chain-icon"
                          style={{
                            display: avatarLoading ? "block" : "none",
                          }}
                        >
                          <Loading />
                        </div>
                        <img
                          ref={avatar}
                          className="chain-icon"
                          style={{
                            width: avatarLoading ? 0 : "1.25rem",
                            opacity: avatarLoading ? 0 : 1,
                          }}
                          src={
                            account.ensAvatar ||
                            `${profileAPIBaseURL}/avatar/${
                              account.ensName || account.address
                            }`
                          }
                          alt={account.address}
                        />

                        {account.displayName}
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
                          <Link href={`/dashboard`}>
                            <SVG
                              src="../icons/icon-wallet.svg"
                              width={20}
                              height={20}
                              className="action mr-1"
                            />
                            Manage Identities
                          </Link>
                        </li>
                        <li className="menu-item dropdown-menu-item">
                          <Link
                            href="/"
                            onClick={async (e) => {
                              e.preventDefault();
                              await disconnect(config);
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
