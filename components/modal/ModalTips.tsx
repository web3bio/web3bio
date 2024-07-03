import { useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import { useAccount } from "wagmi";
import CurrencyInput from "../shared/CurrencyInput";
export default function TipModalContent(props) {
  const { owner, onClose } = props;
  const [amount, setAmount] = useState(0);
  const [symbol, setSymbol] = useState("ETH");
  const [nickName, setNickName] = useState("");
  const [message, setMessage] = useState("");
  const { address } = useAccount();

  const RenderButton = useMemo(() => {
    const ButtonText = (() => {
      if (!address) return "Connect Wallet";
      return "Donate" + amount + symbol;
    })();
    return <div className="btn btn-primary">{ButtonText}</div>;
  }, [address, amount, symbol]);

  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <div className="modal-tip-body">
        <input
          className="token-input"
          type="text"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <CurrencyInput />
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
