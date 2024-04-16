"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchInput from "../search/SearchInput";
import { handleSearchPlatform } from "../../utils/utils";
import { regexBtc, regexSolana } from "../../utils/regexp";
import IndexPageListener from "./IndexPageListener";
import SearchResult from "./SearchResult";
import { HomeFeatures } from "../shared/HomeFeatures";
import { PlatformType } from "../../utils/platform";

export default function HomePage() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlatform, setSearchPlatform] = useState("");
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const router = useRouter();
  const handleSubmit = (value, platform?) => {
    setSearchTerm(value);
    router.push(`/?s=${value}${platform ? "&platform=" + platform : ""}`);
    setSearchPlatform(platform || handleSearchPlatform(value));
    setSearchFocus(true);
  };
  useEffect(() => {
    if (searchParams.get("s")) {
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
            <Link
              href={{
                pathname: "/",
                query: {},
              }}
              className="web3bio-logo"
              title="Web3.bio"
            >
              <h1 className="text-pride">
                WEB3
                <br />
                BIO
              </h1>
              <h2 className="text-assistive">
                Web3.bio is a platform for Web3 and Web 2.0 Identity Graph
                search and link in bio profiles. It provides a list of relevant
                identities when searching for a Twitter handle, Ethereum
                address, ENS domain, Lens profile, Farcaster account,
                Unstoppable Domains, and other Web3 identities.
              </h2>
            </Link>
            <div className="form-label">
              Web3 Identity Search
              <br />
              <small>
                Explore Web3 identities and domains in a whole new way
              </small>
            </div>
            <div className="form-input-group">
              <SearchInput
                // add key here to make defaultValue reactive
                inputRef={inputRef}
                key={searchTerm}
                defaultValue={searchTerm}
                handleSubmit={(value, platform) => {
                  handleSubmit(value, platform);
                }}
              />
            </div>
          </div>
          {searchPlatform && (
            <SearchResult
              searchTerm={
                searchTerm.endsWith(".farcaster")
                  ? searchTerm.replace(".farcaster", "")
                  : searchTerm
              }
              searchPlatform={searchPlatform}
            />
          )}
        </div>
        <IndexPageListener inputRef={inputRef} />
      </div>
      <HomeFeatures />
    </>
  );
}
