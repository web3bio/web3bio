import { useMemo } from "react";
import { useChainId } from "wagmi";
import { tipsTokenMapping } from "../utils/tips";
import { chainIdToNetwork } from "../utils/network";
import SVG from "react-inlinesvg";
import Image from "next/image";

export default function CurrencyInput(props) {
  const { disabled, onChange, value, selected, onSelect } = props;
  const chainId = useChainId();
  const tokenList = useMemo(() => {
    const network = chainIdToNetwork(chainId);
    if (network) return tipsTokenMapping[network];
    return [];
  }, [chainId]);

  return (
    <div className="currency-input-container">
      <input
        disabled={disabled}
        className="common-input"
        value={value}
        onChange={(e) => {
          onChange(e.target.value as any);
        }}
      />
      <div className="token-selector dropdown dropdown-left">
        <div className="btn btn-primary dropdown-toggle">
          <Image
            width={16}
            height={16}
            src={selected.icon}
            alt={selected.symbol}
          />
          {selected.symbol}
          <SVG
            src="../icons/icon-more.svg"
            width={16}
            height={16}
            className="action"
          />
        </div>
        <ul className="menu">
          {tokenList?.map((x) => (
            <li
              key={x.symbol}
              className="menu-item dropdown-menu-item"
              onClick={() => {
                onSelect(x);
              }}
            >
              <Image width={16} height={16} src={x.icon} alt={x.symbol} />
              {x.symbol}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
