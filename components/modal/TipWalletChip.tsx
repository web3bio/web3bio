import { ConnectButton } from "@rainbow-me/rainbowkit";
import SVG from "react-inlinesvg";
import { disconnect } from "@wagmi/core";
import { config } from "../shared/WalletProvider";
import Link from "next/link";
import { formatText } from "../utils/utils";

export default function WalletChip() {
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
                    <div className="dropdown dropdown-right">
                      <div
                        className="dropdown-toggle btn btn-sm"
                        tabIndex={0}
                      >
                        <SVG
                          src="../icons/icon-wallet.svg"
                          width={18}
                          height={18}
                        />
                        {account.displayName || formatText(account.address)}
                      </div>
                      <ul className="menu">
                        <li className="menu-item dropdown-menu-item">
                          <Link href={`/dashboard`} target="_blank">
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
          </>
        );
      }}
    </ConnectButton.Custom>
  );
}
