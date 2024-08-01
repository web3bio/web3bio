import { useMemo } from "react";
import { NetworkData, NetworkMapping } from "../utils/network";
import SVG from 'react-inlinesvg'

export default function TokenListItem(props) {
  const { token, onSelect } = props;
  const networkItem = useMemo(() => {
    return (
      Object.values(NetworkData).find((x) => x.short === token.chain) || null
    );
  }, [token]);
  return (
    <li
      className="menu-item dropdown-menu-item"
      onClick={() => {
        onSelect(token);
      }}
    >
      <div className="item-left">
        <div className="token-logo-container">
          <img className="logo-icon" src={token.logo_url} alt={token.symbol} />
          <SVG
            className="chain-icon"
            style={{
              background: networkItem?.bgColor,
            }}
            fill={ networkItem?.primaryColor}
            src={networkItem?.icon || ''}
          />
        </div>
        {token.symbol} on {token.chain.toUpperCase()}
      </div>

      <div>$ {token.totalPrice}</div>
    </li>
  );
}
