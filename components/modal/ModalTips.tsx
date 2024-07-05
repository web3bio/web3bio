import { useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import { useAccount } from "wagmi";
import CurrencyInput from "../shared/CurrencyInput";
import { useCurrencyBalance } from "../hooks/useCurrency";
import { isGreaterThan } from "../utils/number";
import BigNumber from "bignumber.js";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function TipModalContent(props) {
  const { owner, onClose } = props;
  const [amount, setAmount] = useState(0);
  const [symbol, setSymbol] = useState("ETH");
  const [nickName, setNickName] = useState("");
  const [message, setMessage] = useState("");
  const { address } = useAccount();
  const balance = useCurrencyBalance();

  const RenderButton = useMemo(() => {
    const ButtonText = (() => {
      if (isGreaterThan(new BigNumber(amount), 0))
        return "Insufficient balance";

      return "Donate" + amount + symbol;
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
                      Wrong network
                    </div>
                  );
                }
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
        <CurrencyInput />
        <input
          className="name-input"
          type="text"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />
        <textarea
          className="message-input"
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
