import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import SVG from "react-inlinesvg";
import { NetworkData, NetworkMapping } from "../utils/network";
import { formatBalance } from "../utils/utils";
import TokenListItem from "./TokenListItem";

const getUSDPrice = (amount, price) => {
  const res = Number(amount * price).toFixed(2);
  return Number(res) <= 0.01 ? null : res;
};

export default function TokenSelector(props) {
  const { disabled, onChange, value, selected, onSelect, list, isLoading } =
    props;
  const [menuDisplay, setMenuDisplay] = useState(false);
  const resolvedList = useMemo(
    () =>
      list
        ?.map((x) => ({
          ...x,
          totalPrice: getUSDPrice(x.amount, x.price),
        }))
        .filter((x) => x.totalPrice)
        .sort((a, b) => Number(b.totalPrice) - Number(a.totalPrice)),
    [list]
  );

  useEffect(() => {
    if (!selected) {
      onSelect(resolvedList[0]);
    }
  }, [selected, resolvedList]);
  return (
    <div className="token-selector-container">
      <div className={`token-selector dropdown dropdown-top${menuDisplay ? " active": ""}`}>
        {isLoading ? (
          <div className="btn btn-primary">Loading...</div>
        ) : !list?.length ? null : (
          <div className="chip chip-full" onClick={() => setMenuDisplay(true)} tabIndex={0}>
            <div className="chip-icon">
              <Image
                width={32}
                height={32}
                className="avatar"
                src={selected?.logo_url}
                alt={selected?.symbol}
              />
            </div>
            <div className="chip-content">
              <div className="chip-title">
                {selected?.name}
              </div>
              <div className="chip-subtitle text-gray">
                {selected?.amount.toFixed(2)} {selected?.symbol}
              </div>
            </div>
            <div className="chip-actions">
              <SVG
                className="chip-status-icon"
                title={"Change Token"}
                height={20}
                width={20}
                color={"#121212"}
                src={"/icons/icon-arrow.svg"}
              />
            </div>
          </div>
        )}
        <ul className="menu">
          {resolvedList.map((x) => (
            <TokenListItem
              key={`${x.chain}_${x.symbol}`}
              token={x}
              onSelect={(v) => onSelect(v)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
