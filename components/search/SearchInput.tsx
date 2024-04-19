"use client";
import { useEffect, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import { useSearchParams } from "next/navigation";
import {
  PlatformSystem,
  PlatformType,
  SocialPlatformMapping,
} from "../../utils/platform";
import { getSearchSuggestions } from "../../utils/utils";

export type SearchListItemType = {
  key: PlatformType;
  label: string;
  system?: PlatformSystem;
  icon?: string;
};
export default function SearchInput(props) {
  const { defaultValue, handleSubmit, inputRef } = props;
  const [query, setQuery] = useState(defaultValue);
  const [searchList, setSearchList] = useState<Array<SearchListItemType>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchParams = useSearchParams();
  const web2ScrollContainer = useRef<HTMLDivElement>(null);
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
      if (searchList && searchList.length === 1) return setActiveIndex(0);
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

    if (
      activeIndex >
        searchList.filter((x) => x.system === PlatformSystem.web3)?.length -
          1 &&
      web2ScrollContainer.current
    ) {
      const activeItemId = searchList.find(
        (x) => x.key === searchList[activeIndex].key
      )?.key;
      if (activeItemId) {
        const activeItem = document.getElementById(activeItemId);
        if (!activeItem) return;
        const left = activeItem.getBoundingClientRect().width;
        web2ScrollContainer.current.scrollTo({
          left:
            left *
            (activeIndex -
              searchList.filter((x) => x.system === PlatformSystem.web3)
                ?.length),
          behavior: "smooth",
        });
      }
    }
  }, [query, activeIndex]);
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
          {searchList
            .filter((x) => x.system === PlatformSystem.web3)
            .map((x: { label: string; icon?: string }, idx) => {
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
                  <SVG
                    fill="#121212"
                    src={x.icon || ""}
                    width={20}
                    height={20}
                  />
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
                  ref={web2ScrollContainer}
                  className={"search-web2-list noscrollbar"}
                  style={{
                    padding: 0,
                  }}
                >
                  {searchList
                    .filter((x) => x.system === PlatformSystem.web2)
                    .map((x) => {
                      const activeIdx = searchList.findIndex(
                        (i) => i.key === x.key
                      );
                      return (
                        <div
                          id={x.key}
                          onClick={() =>
                            emitSubmit(null, {
                              label: query,
                              key: x.key,
                              system: PlatformSystem.web2,
                            })
                          }
                          key={x.key}
                          className={
                            activeIndex === activeIdx
                              ? "search-list-item search-list-item-active"
                              : "search-list-item"
                          }
                        >
                          <SVG
                            fill="#121212"
                            src={SocialPlatformMapping(x.key).icon || ""}
                            width={20}
                            height={20}
                          />
                          {query}
                        </div>
                      );
                    })}
                </div>
              </>
            )}
        </div>
      )}
    </>
  );
}
