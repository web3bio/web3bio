"use client";
import { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { useSearchParams } from "next/navigation";
import { PlatformType } from "../../utils/platform";
import { getSearchSuggestions } from "../../utils/utils";

export type SearchListItemType = {
  key: string;
  label: string;
  icon?: string;
};
export default function SearchInput(props) {
  const { defaultValue, handleSubmit, inputRef } = props;
  const [query, setQuery] = useState(defaultValue);
  const [searchList, setSearchList] = useState<Array<SearchListItemType>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchParams = useSearchParams();
  const emitSubmit = (e, value?) => {
    const platfrom = (() => {
      if (!value) return "";
      if (typeof value === "string") return "";
      if ([PlatformType.farcaster, PlatformType.bitcoin].includes(value?.key))
        return value.key;
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
    if (!query || query === defaultValue) {
      setSearchList([]);
    } else {
      setSearchList(getSearchSuggestions(query));
    }
  }, [query]);
  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for Ethereum (ENS), Farcaster, Lens, UD..."
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
                <SVG fill="#121212" src={x.icon || ""} width={20} height={20} />
                {x.label}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
