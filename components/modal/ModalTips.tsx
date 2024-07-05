import { useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import { useAccount } from "wagmi";
import { useCurrencyBalance } from "../hooks/useCurrency";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";

export default function TipModalContent(props) {
  const { onClose, profile } = props;
  const [amount, setAmount] = useState(0.01);
  const [symbol, setSymbol] = useState("ETH");
  const [nickName, setNickName] = useState(profile.displayName);
  const [message, setMessage] = useState("");
  const { address } = useAccount();
  const balance = useCurrencyBalance();

  const RenderButton = useMemo(() => {
    const isBalanceLow =
      amount >= Number(formatEther(balance?.data?.value || 0n));

    const buttonHandle = () => {
      if (isBalanceLow) return null;
    };
    const ButtonText = (() => {
      if (isBalanceLow) return "Insufficient Balance";

      return `Donate ${amount} ${symbol}`;
    })();
    return (
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          return (
            <>
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
                      className="btn btn-primary connect-btn wrong-network"
                    >
                      Wrong Network
                    </div>
                  );
                }
                return (
                  <div
                    onClick={buttonHandle}
                    className={`btn btn-primary donate-btn ${
                      isBalanceLow ? "disabled" : ""
                    }`}
                  >
                    {ButtonText}
                  </div>
                );
              })()}
            </>
          );
        }}
      </ConnectButton.Custom>
    );
  }, [address, amount, symbol, balance]);

  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <div className="modal-tip-body">
        <input
          className="common-input"
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value.replace(/[^0-9]/g, "")));
          }}
        />
        <input
          className="common-input"
          type="text"
          placeholder="Text your nickname here"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />
        <textarea
          className="common-input message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Text your message here"
          rows={4}
          maxLength={300}
        />
        {RenderButton}
      </div>
    </>
  );
}
