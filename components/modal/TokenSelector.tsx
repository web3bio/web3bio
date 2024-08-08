import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import SVG from "react-inlinesvg";
import TokenListItem from "./TokenListItem";
import { networkByIdOrName } from "../utils/network";

const getUSDPrice = (amount, price) => {
  const res = Number(amount * price).toFixed(2);
  return Number(res) <= 0.01 ? null : res;
};

export default function TokenSelector(props) {
  const { selected, onSelect, list, isLoading } = props;
  const [menuDisplay, setMenuDisplay] = useState(false);
  const menu = useRef<HTMLUListElement>(null);
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
    const handleClickOutside = (event) => {
      if (menu?.current && !menu?.current.contains(event.target)) {
        setMenuDisplay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selected, resolvedList]);
  const networkItem = useMemo(() => {
    return networkByIdOrName(0, selected?.chain);
  }, [selected]);
  return (
    <div className="token-selector-container">
      <div
        className={`token-selector dropdown dropdown-top${
          menuDisplay ? " active" : ""
        }`}
      >
        {isLoading ? (
          <div className="btn btn-primary">Loading...</div>
        ) : !list?.length ? null : (
          <div
            className="chip chip-full"
            onClick={(e) => {
              setMenuDisplay(true);
            }}
            tabIndex={0}
          >
            <div className="chip-icon">
              <Image
                width={32}
                height={32}
                className="avatar"
                src={selected?.logo_url}
                alt={selected?.symbol}
              />
              <div
                className="chip-status"
                style={{
                  background: networkItem?.primaryColor,
                }}
              >
                <SVG
                  className="chip-status-icon"
                  title={selected?.chain?.toUpperCase()}
                  fill={networkItem?.bgColor}
                  src={networkItem?.icon || ""}
                />
              </div>
            </div>
            <div className="chip-content">
              <div className="chip-title">{selected?.name}</div>
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
        <ul className="menu" ref={menu}>
          {resolvedList.map((x) => (
            <TokenListItem
              key={`${x.chain}_${x.symbol}`}
              token={x}
              onSelect={(e, v) => {
                e.stopPropagation();
                setMenuDisplay(false);
                onSelect(v);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
