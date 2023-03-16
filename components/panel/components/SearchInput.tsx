import { useEffect, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../../utils/type";
import { handleSearchPlatform } from "../../../utils/utils";

const resolveSearchPlatformIcon = (platform) => {
  return (
    {
      [PlatformType.twitter]: "/icons/icon-twitter.svg",
      [PlatformType.nextid]: "/icons/icon-nextid.svg",
      [PlatformType.ethereum]: "/icons/icon-ethereum.svg",
      [PlatformType.ens]: "/icons/icon-ethereum.svg",
      [PlatformType.lens]: "/icons/icon-lens.svg",
      [PlatformType.dotbit]: "/icons/icon-dotbit.svg",
      [PlatformType.unstoppableDomains]: "icons/icon-unstoppabledomains.svg",
    }[platform] || ""
  );
};

const DomainSearchSuffix = ["eth", "lens", "", "crypto", "dao"];
const fuzzyDomainSuffix = [
  "eth",
  "lens",
  "crypto",
  "dao",
  "bitcoin",
  "blockchain",
  "bit",
  "nft",
  "888",
  "wallet",
  "x",
  "klever",
  "zil",
  "hi",
  "kresus",
];

export const SearchInput = (props) => {
  const { key, defaultValue, handleSubmit } = props;
  const [query, setQuery] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const inputRef = useRef(null);
  const emitSubmit = (e, value?) => {
    setActiveIndex(null);
    if (value) {
      handleSubmit(value);
      return;
    }
    const ipt = inputRef.current;
    if (!ipt) return;
    handleSubmit(ipt.value);
  };

  useEffect(() => {
    if (!query) {
      setSearchList([]);
      return;
    }
    if (query.includes(".")) {
      query[query.length - 1];
      if (query[query.length - 1] == ".") return;
      const backupDomains = fuzzyDomainSuffix.map(
        (x) => query.split(".")[0] + `.${x}`
      );
      setSearchList(
        backupDomains.reduce((pre, cur) => {
          if (cur.includes(query)) {
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
        DomainSearchSuffix.map((x) => {
          const label = query + `${x.length > 0 ? "." : ""}${x}`;
          return {
            icon: resolveSearchPlatformIcon(handleSearchPlatform(label)),
            label: label,
          };
        })
      );
    }

    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        emitSubmit(
          e,
          activeIndex !== null ? searchList[activeIndex].label : ""
        );
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
        type="submit"
        title="Submit"
        className="form-button btn"
        onClickCapture={emitSubmit}
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
                onClick={(e) => emitSubmit(e, x.label)}
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
