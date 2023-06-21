"use client";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchInput from "../components/profile/SearchInput";
import { handleSearchPlatform, isDomainSearch } from "../utils/utils";
import SearchResultDomain from "../components/search/SearchResultDomain";
import SearchResultQuery from "../components/search/SearchResultQuery";
export default function HomePage() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlatform, setsearchPlatform] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({});
  const router = useRouter();
  const handleSubmit = (value, platform?) => {
    setSearchTerm(value);
    router.push("/", {
      query: platform
        ? {
            s: value,
            platform: platform,
          }
        : {
            s: value,
          },
    });
    setsearchPlatform(platform || handleSearchPlatform(value));
    setSearchFocus(true);
  };
  const handleOpenProfileModal = (identity, platform, profile) => {
    setProfileData({
      identity,
      platform,
      profile,
    });

    window.history.pushState({}, "", `/${identity}`);
    setModalOpen(true);
  };
  return (
    <div>
      <NextSeo
        title={
          searchTerm
            ? `${searchTerm} - Web3.bio`
            : "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service"
        }
      />
      <main className="web3bio-container">
        <div className="web3bio-cover flare"></div>

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
                {/* <SearchInput
                  // add key here to make defaultValue reactive
                  key={searchTerm}
                  defaultValue={searchTerm}
                  handleSubmit={(value, platform) => {
                    handleSubmit(value, platform);
                  }}
                /> */}
              </div>
            </div>
            {/* {searchPlatform ? (
              isDomainSearch(searchPlatform) ? (
                <SearchResultDomain
                  onItemClick={handleOpenProfileModal}
                  searchTerm={searchTerm}
                  searchPlatform={searchPlatform}
                />
              ) : (
                <SearchResultQuery
                  onItemClick={handleOpenProfileModal}
                  searchTerm={searchTerm}
                  searchPlatform={searchPlatform}
                />
              )
            ) : null} */}
          </div>
        </div>
      </main>
    </div>
  );
}
