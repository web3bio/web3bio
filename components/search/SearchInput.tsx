"use client";
import { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { useSearchParams } from "next/navigation";
import {
  PlatformSystem,
  PlatformType,
  SocialPlatformMapping,
} from "../../utils/platform";
import { getSearchSuggestions } from "../../utils/utils";
import { DefaultWeb2SearchSuffix } from "../../utils/constants";

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
  const [web2Platforms, setWeb2Platforms] = useState(DefaultWeb2SearchSuffix);
  const searchParams = useSearchParams();
  const emitSubmit = (e, value?) => {
    const platfrom = (() => {
      if (!value) return "";
      if (typeof value === "string") return "";
      if (
        [PlatformType.farcaster, PlatformType.bitcoin].includes(value?.key) ||
        value.system === PlatformSystem.web2
      )
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
      const _value =
        activeIndex === searchList?.length
          ? {
              label: query,
              system: PlatformSystem.web2,
              key: web2Platforms[0],
            }
          : searchList[activeIndex]
          ? searchList[activeIndex]
          : query;
      emitSubmit(e, _value);
    }
    if (e.keyCode === 229) {
      // do nothing
    }

    if (e.key === "Tab") {
      if (activeIndex !== searchList.length) return;
      e.preventDefault();
      const _web2Platforms = JSON.parse(JSON.stringify(web2Platforms));
      const current = web2Platforms[0];
      _web2Platforms.push(current);
      _web2Platforms.shift();
      setWeb2Platforms(_web2Platforms);
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
      if (searchList && searchList.length === 1) return setActiveIndex(0);
      if (activeIndex === null || activeIndex >= searchList.length) {
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
          {!query.includes(".") &&
            !query.includes("。") &&
            query.length < 25 && (
              <>
                <li className="divider" data-content="WEB2" />
                <div
                  className={
                    activeIndex === searchList.length
                      ? "search-list-item search-list-item-active"
                      : "search-list-item"
                  }
                  style={{
                    justifyContent: "space-between",
                  }}
                  onClick={(e) =>
                    emitSubmit(null, {
                      key: web2Platforms[0],
                      system: PlatformSystem.web2,
                      label: query,
                    })
                  }
                >
                  <div
                    key={web2Platforms[0]}
                    className="search-list-item"
                    style={{
                      padding: 0,
                    }}
                  >
                    <SVG
                      fill="#121212"
                      src={SocialPlatformMapping(web2Platforms[0]).icon || ""}
                      width={20}
                      height={20}
                    />
                    {query}
                  </div>
                  <div className="search-item-actions">
                    {web2Platforms
                      .filter((x) => x !== web2Platforms[0])
                      .map((x) => {
                        return (
                          <div key={x} className="search-list-item-action">
                            <SVG
                              fill="#121212"
                              src={SocialPlatformMapping(x).icon || ""}
                              width={20}
                              height={20}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
        </div>
      )}
    </>
  );
}
