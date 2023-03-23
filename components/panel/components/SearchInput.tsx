import router from "next/router";
import { useEffect, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import {
  DomainSearchSuffix,
  fuzzyDomainSuffix,
} from "../../../utils/constants";
import { matchQuery } from "../../../utils/queries";
import { PlatformType } from "../../../utils/type";
import { handleSearchPlatform } from "../../../utils/utils";

const resolveSearchPlatformIcon = (platform) => {
  return (
    {
      [PlatformType.twitter]: "/icons/icon-twitter.svg",
      [PlatformType.nextid]: "/icons/icon-nextid.svg",
      [PlatformType.ethereum]: "/icons/icon-ethereum.svg",
      [PlatformType.ens]: "/icons/icon-ethereum.svg",
      [PlatformType.farcaster]: "/icons/icon-farcaster.svg",
      [PlatformType.lens]: "/icons/icon-lens.svg",
      [PlatformType.dotbit]: "/icons/icon-dotbit.svg",
      [PlatformType.unstoppableDomains]: "icons/icon-unstoppabledomains.svg",
      [PlatformType.space_id]: "/icons/icon-spaceid.svg",
    }[platform] || ""
  );
};

const isQuerySplit = (query: string) => {
  return query.includes(".") || query.includes("。");
};

export const SearchInput = (props) => {
  const { key, defaultValue, handleSubmit } = props;
  const [query, setQuery] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const inputRef = useRef(null);

  const emitSubmit = (e, value?) => {
    if (value === router.query.s) {
      setSearchList([]);
      return;
    }
    const ipt = inputRef.current;
    if (!ipt) return;
    const iptValue = ipt.value;
    const platfrom =
      value && value.key === PlatformType.farcaster
        ? PlatformType.farcaster
        : "";
    const _value = !value
      ? iptValue
      : typeof value === "string"
      ? value
      : value.label;
    handleSubmit(_value, platfrom);
  };

  useEffect(() => {
    if (!query) {
      setSearchList([]);
      return;
    }
    const isLastDot = [".", "。"].includes(query[query.length - 1]);
    if (isQuerySplit(query) && !isLastDot) {
      if (isLastDot) return;
      const backupDomains = fuzzyDomainSuffix.map(
        (x) => matchQuery(query) + `.${x.label}`
      );
      setSearchList(
        backupDomains.reduce((pre, cur) => {
          if (cur.includes(query.replace("。", "."))) {
            pre.push({
              icon: resolveSearchPlatformIcon(handleSearchPlatform(cur)) || "",
              label: cur,
            });
          }
          return pre;
        }, [])
      );
    } else {
      setSearchList(
        DomainSearchSuffix.reduce((pre, cur) => {
          const label =
            matchQuery(query) +
            (cur.label.length > 0 ? `.${cur.label}` : cur.label);
          if (!isLastDot || cur.label.length > 0) {
            pre.push({
              key: cur.key,
              icon: resolveSearchPlatformIcon(cur.key),
              label: label,
            });
          }

          return pre;
        }, [])
      );
    }

    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        emitSubmit(e, activeIndex !== null ? searchList[activeIndex] : "");
      }
      if (e.key === "ArrowUp") {
        if (!activeIndex) {
          setActiveIndex(searchList.length - 1);
        } else {
          setActiveIndex(activeIndex - 1);
        }
      }
      if (e.key === "ArrowDown") {
        if (activeIndex === null || activeIndex >= searchList.length - 1) {
          setActiveIndex(0);
        } else {
          setActiveIndex(activeIndex + 1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, false);

    return () => window.removeEventListener("keydown", onKeyDown, false);
  }, [query, activeIndex]);
  return (
    <>
      <input
        ref={inputRef}
        key={key}
        type="text"
        placeholder="Search ENS, Lens, Twitter, UD or Ethereum"
        defaultValue={defaultValue}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (["Enter", "ArrowUp", "ArrowDown"].includes(e.key))
            e.preventDefault();
          return false;
        }}
        className="form-input input-lg"
        autoCorrect="off"
        autoFocus
        spellCheck="false"
        id="searchbox"
      />
      <button
        className="form-button btn"
        onClick={(e) => {
          const ipt = inputRef.current;
          if (!ipt) return;
          const iptValue = ipt.value;
          emitSubmit(e, iptValue);
        }}
      >
        <SVG
          src="icons/icon-search.svg"
          width={24}
          height={24}
          className="icon"
        />
      </button>
      {searchList.length > 0 && (
        <div className="search-list">
          {searchList.map((x, idx) => {
            return (
              <div
                className={
                  activeIndex === idx
                    ? "search-list-item search-list-item-active"
                    : "search-list-item"
                }
                key={idx}
                onClick={(e) => emitSubmit(e, x)}
              >
                <SVG src={x.icon} width={20} height={20} />
                {x.label}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
