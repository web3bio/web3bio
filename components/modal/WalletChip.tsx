import { ConnectButton } from "@rainbow-me/rainbowkit";
import SVG from "react-inlinesvg";
import { disconnect } from "@wagmi/core";
import { useState } from "react";
import Clipboard from "react-clipboard.js";
import { config } from "../shared/WalletProvider";
import Link from "next/link";
import { formatText } from "../utils/utils";

export default function WalletChip() {
  const [isCopied, setIsCopied] = useState(false);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <>
            {(() => {
              return (
                connected && (
                  <div className="wallet-container">
                    <SVG
                      src={"/icons/icon-wallet.svg"}
                      width={22}
                      height={22}
                    />

                    <div className="dropdown">
                      <div
                        className="dropdown-toggle btn btn-link"
                        tabIndex={0}
                      >
                        {account.displayName || formatText(account.address)}
                        <SVG
                          src="../icons/icon-arrow.svg"
                          width={18}
                          height={18}
                          className="action-arrow"
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
                                width={18}
                                height={18}
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
                              width={18}
                              height={18}
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
                              width={18}
                              height={18}
                              className="action mr-1"
                            />
                            Disconnect
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )
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
          </>
        );
      }}
    </ConnectButton.Custom>
  );
}
