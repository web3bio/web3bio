import SVG from "react-inlinesvg";
import { formatBalance } from "../utils/utils";
import TokenListItem from "./TokenListItem";

const getUSDPrice = (amount, price) => {
  const res = Number(amount * price).toFixed(2);
  return Number(res) <= 0.01 ? null : res;
};

export default function CurrencyInput(props) {
  const { disabled, onChange, value, selected, onSelect, list, isLoading } =
    props;

  return (
    <>
      <div className="currency-input-container">
        <input
          disabled={disabled}
          className="common-input"
          value={value}
          onChange={(e) => {
            onChange(e.target.value as any);
          }}
        />
        <div className="token-selector dropdown">
          {isLoading ? (
            <div className="btn btn-primary">Loading...</div>
          ) : !list?.length ? null : (
            <div className="btn btn-primary dropdown-toggle" tabIndex={0}>
              <img
                width={16}
                height={16}
                src={selected?.logo_url}
                alt={selected?.symbol}
              />
              {selected?.symbol}
              <SVG
                src="../icons/icon-more.svg"
                width={16}
                height={16}
                className="action"
              />
            </div>
          )}
          <ul className="menu">
            {list
              ?.map((x) => ({
                ...x,
                totalPrice: getUSDPrice(x.amount, x.price),
              }))
              .filter((x) => x.totalPrice)
              .sort((a, b) => Number(b.totalPrice) - Number(a.totalPrice))
              .map((x) => (
                <TokenListItem
                  key={`${x.chain}_${x.symbol}`}
                  token={x}
                  onSelect={(v) => onSelect(v)}
                />
              ))}
          </ul>
        </div>
      </div>
      {selected && (
        <div className="balance-text">
          Balance: {formatBalance(selected.raw_amount, selected.decimals)}
        </div>
      )}
    </>
  );
}
