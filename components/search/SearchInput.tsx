"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PlatformSystem,
  PlatformType,
  SocialPlatformMapping,
} from "../utils/platform";
import { getSearchSuggestions } from "../utils/suggestions";

// Search input component
export default function SearchInput(props) {
  const { defaultValue, handleSubmit, inputRef } = props;
  const searchListRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(defaultValue);
  const [searchList, setSearchList] = useState<Array<any>>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = useSearchParams()?.get("domain");
  const emitSubmit = useCallback(
    (e, value?) => {
      const _value = typeof value === "string" ? value : value?.label || "";
      if (domain) {
        handleSubmit(_value, "domain");
        setQuery(_value);
        setSearchList([]);
        return;
      }
      const platform =
        (value?.key &&
          [PlatformType.farcaster, PlatformType.bitcoin].includes(value.key)) ||
        value?.system === PlatformSystem.web2
          ? value.key
          : "";
      handleSubmit(_value, platform);
      setQuery(_value);
      setSearchList([]);
    },
    [handleSubmit, domain],
  );

  const isHistoryMode = useMemo(() => {
    return searchList.some((x) => x.history);
  }, [searchList]);

  const filteredWeb3List = useMemo(
    () => searchList.filter((x) => x.system === PlatformSystem.web3),
    [searchList],
  );

  const filteredWeb2List = useMemo(
    () => searchList.filter((x) => x.system === PlatformSystem.web2),
    [searchList],
  );
  const setHistory = useCallback(() => {
    if (searchParams?.get("domain")) return;
    const history =
      JSON.parse(localStorage.getItem("history") || "[]")
        ?.slice(-5)
        .reverse() || [];
    if (history?.length > 0) {
      setSearchList([...history, { key: "clear" }]);
    }
  }, [searchParams]);

  const clearHistory = useCallback(() => {
    setSearchList([]);
    localStorage.setItem("history", "[]");
  }, []);
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        const _value = searchList[activeIndex] || query.replaceAll("。", ".");
        if (_value?.key === "clear") {
          clearHistory();
        }
        if (_value?.key === "domain" || e.shiftKey) {
          emitSubmit(e, {
            label: query,
            key: "domain",
            system: PlatformSystem.web2,
          });
        } else {
          emitSubmit(e, _value);
        }
      } else if (e.key === "Escape") {
        setActiveIndex(-1);
        if (searchList.some((x) => x.history)) {
          setSearchList([]);
        }
      } else if (e.key === "ArrowUp" || (e.shiftKey && e.key === "Tab")) {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex <= 0 ? searchList.length - 1 : prevIndex - 1,
        );
      } else if (e.key === "ArrowDown" || (!e.shiftKey && e.key === "Tab")) {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex >= searchList.length - 1 ? 0 : prevIndex + 1,
        );
      }
    },
    [searchList, activeIndex, query, emitSubmit, clearHistory],
  );

  const handleQueryChange = useCallback(
    (e) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      if (!newQuery) {
        setSearchList([]);
        setHistory();
      } else {
        setSearchList([
          ...getSearchSuggestions(newQuery.replaceAll("。", ".")),
          {
            key: "domain",
          },
        ]);
      }
      setActiveIndex(-1);
    },
    [setHistory],
  );
  const shouldShowWeb2List = useMemo(
    () => ![".", "。", "/"].some((x) => query.includes(x)) && query.length < 25,
    [query],
  );

  useEffect(() => {
    const handleInputBlur = (e) => {
      if (
        !inputRef?.current?.contains(e.target) &&
        !searchListRef?.current?.contains(e.target)
      ) {
        if (searchList.length > 0 && searchList.some((x) => x.history)) {
          setSearchList([]);
        }
      }
    };
    document.addEventListener("click", handleInputBlur);

    return () => document.removeEventListener("click", handleInputBlur);
  }, [inputRef, searchListRef, searchList]);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Ethereum (ENS), Farcaster, Lens, UD, or Web3 domains..."
        value={query}
        onChange={handleQueryChange}
        onFocus={() => {
          if (!query && !searchList.length) {
            setHistory();
          }
        }}
        onKeyDown={onKeyDown}
        className={`form-input input-lg${domain ? " form-input-back" : ""}`}
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        id="searchbox"
      />
      <button
        className="form-button btn"
        onClick={(e) => emitSubmit(e, query.replaceAll("。", "."))}
      >
        <SVG
          src="icons/icon-search.svg"
          width={24}
          height={24}
          className="icon"
        />
      </button>
      {domain && (
        <button
          className="back-button btn"
          onClick={() => {
            router.push(`/`);
          }}
          aria-label="Go back to home"
        >
          <SVG
            src="icons/icon-back.svg"
            width={24}
            height={24}
            className="icon"
          />
        </button>
      )}

      {searchList.length > 0 && (
        <div className="search-list" ref={searchListRef}>
          {isHistoryMode && (
            <div className="search-list-header">
              <span className="search-list-text text-gray">Recent Searches</span>
              <button
                className={`btn btn-link btn-sm ${
                  activeIndex === searchList.length - 1 ? "active" : ""
                }`}
                onClick={clearHistory}
              >
                Clear History
              </button>
            </div>
          )}
          <div className="search-list-body">
            {filteredWeb3List.map((x, idx) => (
              <div
                className={`search-list-item${
                  activeIndex === idx ? " active" : ""
                }`}
                key={x.label + idx}
                onClick={(e) => emitSubmit(e, x)}
              >
                <div className="icon">
                  <SVG
                    fill="#121212"
                    src={x.icon || "icons/icon-search.svg"}
                    width={20}
                    height={20}
                  />
                </div>
                <div className="search-list-item-label">{x.label}</div>
              </div>
            ))}
            {filteredWeb3List.length > 0 && !isHistoryMode && (
              <div className="divider"></div>
            )}
            {!isHistoryMode && (
              <div className={"search-web2-list noscrollbar"}>
                {shouldShowWeb2List && (
                  <>
                    {filteredWeb2List.map((x) => {
                      const activeIdx = searchList.findIndex(
                        (i) => i.key === x.key,
                      );
                      return (
                        <div
                          id={x.key}
                          onClick={() =>
                            emitSubmit(null, {
                              ...x,
                              label: query,
                              system: PlatformSystem.web2,
                            })
                          }
                          key={x.key}
                          className={`search-list-item search-list-item-sm ${
                            activeIndex === activeIdx ? " active" : ""
                          }`}
                        >
                          <SVG
                            fill="#121212"
                            src={SocialPlatformMapping(x.key).icon || ""}
                            width={20}
                            height={20}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
                <div
                  className={`btn btn-link btn-suggest${
                    activeIndex === searchList.length - 1 ? " active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    emitSubmit(e, {
                      label: query,
                      key: "domain",
                      system: PlatformSystem.web2,
                    });
                  }}
                >
                  <SVG src={"icons/icon-suggestion.svg"} width={20} height={20} />
                  <span className="hide-sm">Check Availability</span>
                </div>
              </div>
            )}
          </div>

          <div className="search-list-footer hide-sm">
            <div className="search-list-text">
              <span className="label-kbd">&uarr;&darr;</span>
              <span className="label-kbd">TAB</span> to navigate
              <span className="label-kbd ml-2">ESC</span> to cancel
              <span className="label-kbd ml-2">&crarr;</span> to select
            </div>
          </div>
        </div>
      )}
    </>
  );
}
