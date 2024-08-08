import { useMemo } from "react";
import Image from "next/image";
import SVG from "react-inlinesvg";
import { networkByIdOrName } from "../utils/network";

export default function TokenListItem(props) {
  const { token, onSelect } = props;
  const networkItem = useMemo(() => {
    return networkByIdOrName(0, token.chain);
  }, [token]);
  return (
    <li className="menu-item dropdown-menu-item">
      <div
        className="chip"
        onClick={(e) => {
          onSelect(e, token);
        }}
      >
        <div className="chip-icon">
          <Image
            width={32}
            height={32}
            className="avatar"
            src={token.logo_url}
            alt={token.name}
          />
          <div
            className="chip-status"
            style={{
              background: networkItem?.primaryColor,
            }}
          >
            <SVG
              className="chip-status-icon"
              title={token.chain.toUpperCase()}
              fill={networkItem?.bgColor}
              src={networkItem?.icon || ""}
            />
          </div>
        </div>
        <div className="chip-content">
          <div className="chip-title">
            <span>{token.name} </span>
            <span>${token.totalPrice}</span>
          </div>
          <div className="chip-subtitle text-gray">
            <span>
              {token.amount.toFixed(2)} {token.symbol}
            </span>
            <span>${token.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
