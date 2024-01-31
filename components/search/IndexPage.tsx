"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchInput from "../search/SearchInput";
import { handleSearchPlatform, isDomainSearch } from "../../utils/utils";
import SearchResult from "./SearchResult";

export default function HomePage() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlatform, setSearchPlatform] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSubmit = (value, platform?) => {
    setSearchTerm(value);
    router.push(`/?s=${value}${platform ? "&platform=" + platform : ""}`);
    setSearchPlatform(platform || handleSearchPlatform(value));
    setSearchFocus(true);
  };
  useEffect(() => {
    if (searchParams.get("s")) {
      const query = searchParams.get("s");
      setSearchFocus(true);
      // todo: check the type of router querys
      const searchkeyword = query!.toLowerCase();
      setSearchTerm(searchkeyword);
      if (!searchParams.get("platform")) {
        let searchPlatform = handleSearchPlatform(searchkeyword);
        setSearchPlatform(searchPlatform);
      } else {
        setSearchPlatform(searchParams.get("platform")!.toLowerCase());
      }
    } else {
      setSearchFocus(false);
      setSearchTerm("");
      setSearchPlatform("");
    }
  }, [router, searchParams]);

  return (
    <div className={searchFocus ? "web3bio-search focused" : "web3bio-search"}>
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
              Web3.bio is a platform for Web3 and Web 2.0 Identity Graph search
              and link in bio profiles. It provides a list of relevant
              identities when searching for a Twitter handle, Ethereum address,
              ENS domain, Lens profile, Farcaster account, Unstoppable Domains,
              and other Web3 identities.
            </h2>
          </Link>
          <div className="form-label">
            Web3 Identity Search
            <br />
            <small>Discover Web3 Identity Graph and Profiles</small>
          </div>
          <div className="form-input-group">
            <SearchInput
              // add key here to make defaultValue reactive
              key={searchTerm}
              defaultValue={searchTerm}
              handleSubmit={(value, platform) => {
                handleSubmit(value, platform);
              }}
            />
          </div>
        </div>
        {searchPlatform ? (
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
    </div>
  );
}
