"use client";
import { useEffect, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import { DefaultSearchSuffix, fuzzyDomainSuffix } from "../../utils/constants";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
import { matchQuery } from "../../utils/queries";
import { handleSearchPlatform } from "../../utils/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const isQuerySplit = (query: string) => {
  return query.includes(".") || query.includes("。");
};

type SearchListItem = {
  key: string;
  label: string;
  icon?: string;
};
export default function SearchInput(props) {
  const { defaultValue, handleSubmit } = props;
  const [query, setQuery] = useState(defaultValue);
  const [searchList, setSearchList] = useState<SearchListItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const emitSubmit = (e, value?) => {
    const platfrom = (() => {
      if (!value) return "";
      if (typeof value === "string") return "";
      if (value.key && value.key === PlatformType.farcaster)
        return PlatformType.farcaster;
    })();

    const _value = (() => {
      if (!value) return "";
      if (typeof value === "string") return value;
      return value.label;
    })();
    if (_value && _value === searchParams?.get("s")) {
      setQuery(_value);
    }
    handleSubmit(_value, platfrom);
    setSearchList([]);
    setActiveIndex(0);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      const _value = searchList[activeIndex] ? searchList[activeIndex] : query;
      emitSubmit(e, _value);
    }
    if (e.keyCode === 229) {
      // do nothing
    }
    if (e.key === "ArrowUp") {
      if (searchList?.length) e.preventDefault();
      if (searchList && searchList.length === 1) {
        setActiveIndex(0);
        return;
      }
      if (!activeIndex) {
        setActiveIndex(searchList.length - 1);
      } else {
        setActiveIndex(activeIndex - 1);
      }
    }
    if (e.key === "ArrowDown") {
      if (searchList?.length) e.preventDefault();
      if (searchList && searchList.length === 1) {
        setActiveIndex(0);
        return;
      }
      if (activeIndex === null || activeIndex >= searchList.length - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex(activeIndex + 1);
      }
    }
  };
  useEffect(() => {
    if (!query || query.length > 20 || query === searchParams?.get("s")) {
      setSearchList([]);
      return;
    }
    const isLastDot = [".", "。"].includes(query[query.length - 1]);
    if (isQuerySplit(query) && !isLastDot) {
      if (isLastDot) return;
      const backupDomains = fuzzyDomainSuffix.map((x) => ({
        key: x.key,
        text: matchQuery(query) + `.${x.label}`,
        icon: x.icon,
      }));
      setSearchList(
        backupDomains.reduce((pre, cur) => {
          if (cur.text.includes(query.replace("。", "."))) {
            pre.push({
              key: cur.key,
              icon:
                cur?.icon ||
                SocialPlatformMapping(handleSearchPlatform(cur.text)).icon ||
                "",
              label: cur.text,
            });
          }
          return pre;
        }, [] as SearchListItem[])
      );
    } else {
      setSearchList(
        DefaultSearchSuffix.reduce((pre, cur) => {
          const label =
            matchQuery(query) + (cur.label.length > 0 ? `.${cur.label}` : "");
          if (isLastDot && cur.key === PlatformType.farcaster) {
            pre.push({
              key: cur.key,
              icon: SocialPlatformMapping(cur.key).icon,
              label: label + "." + cur.optional,
            });
          }
          if (!isLastDot || cur.label.length > 0) {
            if (cur.maxLength) {
              if (label?.length < cur.maxLength) {
                pre.push({
                  key: cur.key,
                  icon: SocialPlatformMapping(cur.key).icon,
                  label: label,
                });
              }
            } else {
              pre.push({
                key: cur.key,
                icon: SocialPlatformMapping(cur.key).icon,
                label: label,
              });
            }
          }

          return pre;
        }, new Array<SearchListItem>())
      );
    }
  }, [query, activeIndex, searchParams]);
  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search Ethereum (ENS), Lens, Farcaster, UD..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyDown={onKeyDown}
        className="form-input input-lg"
        autoCorrect="off"
        autoComplete="off"
        autoFocus
        spellCheck="false"
        id="searchbox"
      />
      <button
        className="form-button btn"
        onClick={(e) => {
          const ipt = inputRef.current;
          if (!ipt) return;
          emitSubmit(e, (ipt as { value: string }).value);
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
          {searchList.map((x: { label: string; icon?: string }, idx) => {
            return (
              <div
                className={
                  activeIndex === idx
                    ? "search-list-item search-list-item-active"
                    : "search-list-item"
                }
                key={x.label + idx}
                onClick={(e) => emitSubmit(e, x)}
              >
                <SVG fill="#000" src={x.icon || ""} width={20} height={20} />
                {x.label}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
