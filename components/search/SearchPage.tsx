"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import SearchInput from "./SearchInput";
import { handleSearchPlatform, formatText } from "../utils/utils";
import { regexBtc, regexSolana } from "../utils/regexp";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import SearchPageListener from "./SearchPageListener";
import SearchResult from "./SearchResult";
import DomainsSuggest from "./DomainsSuggest";

export const renderBadge = (platform, identity) => {
  return (
    <Link
      href={`/?s=${identity}&platform=${platform}`}
      className={`platform-badge`}
      title={`Search ${identity} on ${SocialPlatformMapping(platform).label}`}
    >
      <div className="platform-badge-icon">
        <SVG
          fill={SocialPlatformMapping(platform).color}
          width={20}
          height={20}
          src={SocialPlatformMapping(platform).icon || ""}
        />
      </div>
      <span className="platform-badge-name">{formatText(identity)}</span>
    </Link>
  );
};

export default function SearchPage() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlatform, setSearchPlatform] = useState("");
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const router = useRouter();
  const handleSubmit = (value, platform?) => {
    setSearchTerm(value);
    router.push(
      `/?s=${value}${
        platform === "suggest"
          ? "&a=true"
          : platform
          ? "&platform=" + platform
          : ""
      }`
    );

    setSearchPlatform(platform || handleSearchPlatform(value));
    setSearchFocus(true);
  };
  useEffect(() => {
    if (searchParams?.get("s")) {
      const query = searchParams.get("s") || "";
      const _paramPlatform = searchParams.get("platform");
      setSearchFocus(true);
      const searchkeyword = [regexSolana, regexBtc].some((x) => x.test(query))
        ? query
        : query.toLowerCase();
      setSearchTerm(searchkeyword);
      if (!_paramPlatform) {
        setSearchPlatform(handleSearchPlatform(searchkeyword));
      } else {
        setSearchPlatform(_paramPlatform.toLowerCase());
      }
    } else {
      setSearchFocus(false);
      setSearchTerm("");
      setSearchPlatform("");
    }
  }, [router, searchParams]);

  return (
    <>
      <div
        className={searchFocus ? "web3bio-search focused" : "web3bio-search"}
      >
        <div className="container grid-sm">
          <div className="search-form">
            <div className="form-label">
              Web3 Identity Search
              <br />
              <small>Dive into the Web3 Identity Graph and Profiles</small>
            </div>
            <div className="form-input-group">
              <SearchInput
                // add key here to make defaultValue reactive
                inputRef={inputRef}
                key={searchTerm}
                defaultValue={searchTerm}
                handleSubmit={handleSubmit}
              />
            </div>
            {!searchTerm && (
              <div className="search-badges">
                <div className="search-badges-title mr-2">Trending: </div>
                {renderBadge(PlatformType.ens, "vitalik.eth")}
                {renderBadge(
                  PlatformType.ethereum,
                  "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
                )}
                {renderBadge(PlatformType.farcaster, "dwr.eth")}
                {renderBadge(PlatformType.lens, "stani.lens")}
                {renderBadge(PlatformType.twitter, "suji_yan")}
              </div>
            )}
          </div>
          {searchParams?.get("a") ? (
            <DomainsSuggest searchTerm={searchTerm} />
          ) : searchTerm ? (
            <SearchResult
              searchTerm={
                searchTerm.endsWith(".farcaster")
                  ? searchTerm.replace(".farcaster", "")
                  : searchTerm
              }
              searchPlatform={searchPlatform}
            />
          ) : null}
        </div>
        <SearchPageListener inputRef={inputRef} />
      </div>
    </>
  );
}
