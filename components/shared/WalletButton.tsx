"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletButton(props) {
  const {} = props;
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
                    <div onClick={openConnectModal} className="btn">
                      Connect Wallet
                    </div>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <div onClick={openChainModal} className="btn">
                      Wrong network
                    </div>
                  );
                }

                return (
                  <div className="wallet-container">
                    <div className="btn" onClick={openChainModal}>
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className={"chainIcon"}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </div>

                    <div className="dropdown">
                      <div className="btn dropdown-toggle" tabIndex={0}>
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </div>
                      <ul className="menu">
                        <li className="menu-item dropdown-menu-item">
                          Copy Address
                        </li>
                        <li className="menu-item dropdown-menu-item">
                          Disconnect
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
