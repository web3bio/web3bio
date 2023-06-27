"use client";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { ApolloProvider } from "@apollo/client";
import client from "../../utils/apollo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchInput from "../../components/profile/SearchInput";
import { handleSearchPlatform, isDomainSearch } from "../../utils/utils";
import SearchResultDomain from "../../components/search/SearchResultDomain";
import SearchResultQuery from "../../components/search/SearchResultQuery";

export default function HomePage() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlatform, setsearchPlatform] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSubmit = (value, platform?) => {
    setSearchTerm(value);
    router.push(`/?s=${value}${platform ? "&platform=" + platform : ""}`);
    setsearchPlatform(platform || handleSearchPlatform(value));
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
        setsearchPlatform(searchPlatform);
      } else {
        setsearchPlatform(searchParams.get("platform")!.toLowerCase());
      }
    } else {
      setSearchFocus(false);
      setSearchTerm("");
      setsearchPlatform("");
    }
  }, [router, searchParams]);

  return (
    <ApolloProvider client={client}>
      <div
        className={searchFocus ? "web3bio-search focused" : "web3bio-search"}
      >
        <div className="container grid-xs">
          <div className="search-form">
            <Link
              href={{
                pathname: "/",
                query: {},
              }}
            >
              <div className="web3bio-logo" title="Web3.bio">
                <h1 className="text-pride">
                  WEB3
                  <br />
                  BIO
                </h1>
              </div>
            </Link>
            <div className="form-label">
              Web3 <span>Identity Search</span>
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
            isDomainSearch(searchPlatform) ? (
              <SearchResultDomain
                searchTerm={searchTerm}
                searchPlatform={searchPlatform}
              />
            ) : (
              <SearchResultQuery
                searchTerm={searchTerm}
                searchPlatform={searchPlatform}
              />
            )
          ) : null}
        </div>
      </div>
      <GoogleAnalytics strategy="lazyOnload" />
    </ApolloProvider>
  );
}
