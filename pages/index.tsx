import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { handleSearchPlatform, isDomainSearch } from "../utils/utils";
import dynamic from "next/dynamic";
import SearchInput from "../components/profile/SearchInput";
import { Footer } from "../components/shared/Footer";
import ShareButton from "../components/shared/ShareButton";

const DynamicProfileModal = dynamic(
  () => import("../components/profile/ProfileModal")
);
const DynamicResultDomain = dynamic(
  () => import("../components/search/SearchResultDomain")
);
const DynamicResultQuery = dynamic(
  () => import("../components/search/SearchResultQuery")
);

export default function Home() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlatform, setsearchPlatform] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [profileIdentity, setProfileIdentity] = useState(null);
  const [profilePlatform, setProfilePlatform] = useState(null);
  const router = useRouter();

  const handleSubmit = (value, platform?) => {
    setSearchTerm(value);
    router.push({
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

  const handleOpenProfileModal = (identity, platform) => {
    setProfileIdentity(identity);
    setProfilePlatform(platform);
    window.history.pushState({}, "", `/${identity}`);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.s) {
      setSearchFocus(true);
      // todo: check the type of router querys
      const searchkeyword = (router.query.s as string).toLowerCase();
      setSearchTerm(searchkeyword);
      if (!router.query.platform) {
        let searchPlatform = handleSearchPlatform(searchkeyword);
        setsearchPlatform(searchPlatform);
      } else {
        setsearchPlatform((router.query.platform as string).toLowerCase());
      }
    } else {
      setSearchFocus(false);
      setSearchTerm("");
      setsearchPlatform("");
    }
  }, [router.isReady, router.query.s, router.query.platform]);
  useEffect(() => {
    const handlePopStateChange = () => {
      if (window.location.search.includes("?s=")) setModalOpen(false);
    };
    window.addEventListener("popstate", handlePopStateChange);
    return () => window.removeEventListener("popstate", handlePopStateChange);
  });
  return (
    <div>
      <NextSeo title={searchTerm ? `${searchTerm} - Web3.bio` : "Web3.bio"} />
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
                <DynamicResultDomain
                  onItemClick={handleOpenProfileModal}
                  searchTerm={searchTerm}
                  searchPlatform={searchPlatform}
                />
              ) : (
                <DynamicResultQuery
                  onItemClick={handleOpenProfileModal}
                  searchTerm={searchTerm}
                  searchPlatform={searchPlatform}
                />
              )
            ) : null}
          </div>
        </div>
      </main>
      <div className="web3bio-footer">
        <div className="container grid-lg">
          <div className="columns mt-2 mb-2">
            <div className="column col-4 col-sm-12 mt-2 mb-2">
              <div className="card-feature">
                <div className="feature-header text-center">
                  <h3>New Search Support</h3>
                  <h4>
                    Search for Web3 identities with these new{" "}
                    <strong>domains and accounts</strong>.
                  </h4>
                </div>

                <div className="feature-body feature-body-first text-center">
                  <div
                    className="identity identity-farcaster"
                    title="Farcaster identities"
                  >
                    <SVG
                      src="icons/icon-farcaster.svg"
                      width={20}
                      height={20}
                      className="icon mr-1"
                    />{" "}
                    Farcaster
                  </div>
                  <div
                    className="identity identity-lens"
                    title="Lens identities (.lens)"
                  >
                    <SVG
                      src="icons/icon-lens.svg"
                      width={20}
                      height={20}
                      className="icon mr-1"
                    />
                    Lens
                  </div>
                  <div
                    className="identity identity-unstoppabledomains"
                    title="Unstoppable Domains"
                  >
                    <SVG
                      src="icons/icon-unstoppabledomains.svg"
                      width={20}
                      height={20}
                      className="icon mr-1"
                    />
                    Unstoppable Domains
                  </div>
                  <div
                    className="identity identity-spaceid"
                    title="SPACE ID domains"
                  >
                    <SVG
                      src="icons/icon-spaceid.svg"
                      width={20}
                      height={20}
                      className="icon mr-1"
                    />{" "}
                    SPACE ID
                  </div>
                </div>
              </div>
            </div>
            <div className="column col-4 col-sm-12 mt-2 mb-2">
              <div className="card-feature">
                <div className="feature-header text-center">
                  <h3>Visualize Identity Graph</h3>
                  <h4>
                    Deep dive into Web3 identities and connections across
                    digital space.
                  </h4>
                </div>
                <div className="feature-body feature-body-graph text-center">
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="btn">
                    <SVG
                      src={"/icons/icon-view.svg"}
                      width={24}
                      height={24}
                      className="icon mr-1"
                    />{" "}
                    Visualize
                  </div>
                </div>
              </div>
            </div>
            <div className="column col-4 col-sm-12 mt-2 mb-2">
              <div className="card-feature">
                <div className="feature-header text-center">
                  <h3>
                    Your Web3 Profile{" "}
                    <small className="text-small label label-primary">
                      Beta
                    </small>
                  </h3>
                  <h4>
                    One page to show who you are and everything you make and
                    own.
                  </h4>
                </div>
                <div className="feature-body feature-body-profile text-center">
                  <div className="demo-profile">
                    <div className="avatar avatar-lg avatar-1">🦄</div>
                  </div>
                  <div className="demo-profile">
                    <div className="avatar avatar-lg avatar-2">👨‍🌾</div>
                  </div>
                  <div className="demo-profile">
                    <div className="avatar avatar-lg avatar-3">👩‍🎨</div>
                  </div>
                  <div className="demo-profile">
                    <div className="avatar avatar-lg avatar-4">🧑‍🚀</div>
                  </div>
                  <div className="demo-profile">
                    <div className="avatar avatar-lg avatar-5">🐳</div>
                  </div>
                  <div className="demo-profile">
                    <div className="avatar avatar-lg avatar-6">🦸‍♂️</div>
                  </div>
                  <div className="demo-profile">
                    <div className="avatar avatar-lg avatar-7">👨‍💻</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center container grid-lg">
          <div className="columns">
            <div className="column col-12">
              <Footer />
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <DynamicProfileModal
          onClose={() => {
            window.history.go(-1);
            setModalOpen(false);
          }}
          identity={profileIdentity}
          platform={profilePlatform}
        />
      )}
    </div>
  );
}
