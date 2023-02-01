import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import SVG from "react-inlinesvg";
import { TabsMap } from "../components/panel/IdentityPanel";
import { SearchResultDomain } from "../components/search/SearchResultDomain";
import { SearchResultQuery } from "../components/search/SearchResultQuery";
import { PlatformType } from "../utils/type";
import { handleSearchPlatform, isDomainSearch } from "../utils/utils";
import ProfilePage from "./[...domain]";

export default function Home() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [profileIdentity, setProfileIdentity] = useState(null);
  const [profilePlatform, setProfilePlatform] = useState(null);
  const [searchPlatform, setsearchPlatform] = useState("");
  const [panelTab, setPanelTab] = useState(TabsMap.profile.key);
  const [domain, setDomain] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    const ipt = inputRef.current;
    if (!ipt) return;
    setSearchTerm(ipt.value);
    router.push({
      query: {
        s: ipt.value,
      },
    });
    setsearchPlatform(handleSearchPlatform(ipt.value));
    setSearchFocus(true);
  };

  const openProfile = (identity, platform) => {
    setProfileIdentity(identity);
    setProfilePlatform(platform);
    if (platform === PlatformType.lens) {
      setDomain([identity.identity]);
    } else {
      setDomain([identity.displayName || identity.identity]);
    }
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
    if (!router.isReady) return;
    if (modalOpen) {
      window.history.replaceState(
        {},
        "",
        `/${profileIdentity.displayName || profileIdentity.identity}${
          panelTab === TabsMap.profile.key ? "" : `/${panelTab}`
        }`
      );
    } else {
      router.replace({
        pathname: "",
        query: router.query,
      });
    }
  }, [modalOpen, panelTab, router.query.s, router.isReady]);

  return (
    <div>
      <Head>
        {searchTerm ? (
          <title>{searchTerm} - Web5.bio</title>
        ) : (
          <title>Web5.bio</title>
        )}
        <meta
          name="description"
          content="Web5.bio is a Web3 and Web 2.0 Identity Graph search service which is powered by Next.ID. Web5.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain or Lens Profile."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main className="web3bio-container">
        <div className="web3bio-cover flare"></div>

        <div
          className={searchFocus ? "web3bio-search focused" : "web3bio-search"}
        >
          <div className="container grid-xs">
            <form autoComplete="off" role="search" className="search-form">
              <Link
                href={{
                  pathname: "/",
                  query: {},
                }}
              >
                <div className="web3bio-logo" title="Web5.bio">
                  <h1 className="text-pride">
                    WEB5
                    <br />
                    BIO
                  </h1>
                </div>
              </Link>
              <div className="form-label">
                Web3 <span>Identity Search</span>
              </div>
              <div className="form-input-group">
                <input
                  ref={inputRef}
                  key={searchTerm}
                  type="text"
                  placeholder="Search Twitter, Lens, ENS or Ethereum"
                  defaultValue={searchTerm}
                  className="form-input input-lg"
                  autoCorrect="off"
                  autoFocus
                  spellCheck="false"
                  id="searchbox"
                />
                <button
                  type="submit"
                  title="Submit"
                  className="form-button btn"
                  onClickCapture={handleSubmit}
                >
                  <SVG
                    src="icons/icon-search.svg"
                    width={24}
                    height={24}
                    className="icon"
                  />
                </button>
              </div>
            </form>
            {searchPlatform ? (
              isDomainSearch(searchPlatform) ? (
                <SearchResultDomain
                  openProfile={openProfile}
                  searchTerm={searchTerm}
                  searchPlatform={searchPlatform}
                />
              ) : (
                <SearchResultQuery
                  openProfile={openProfile}
                  searchTerm={searchTerm}
                  searchPlatform={searchPlatform}
                />
              )
            ) : null}
          </div>
        </div>
        <div className="web3bio-footer">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <div className="mt-4 mb-4">
                  <a
                    href="https://twitter.com/web3bio"
                    className="btn-link text-dark ml-2 mr-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SVG
                      src="icons/icon-twitter.svg"
                      width={20}
                      height={20}
                      className="icon"
                    />
                  </a>
                  <a
                    href="https://github.com/web3bio/web5bio"
                    className="btn-link ml-2 mr-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SVG
                      src="icons/icon-github.svg"
                      width={20}
                      height={20}
                      className="icon"
                    />
                  </a>
                </div>
                <div className="mt-2">
                  A{" "}
                  <a
                    href="https://web3.bio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Web3.bio
                  </a>{" "}
                  project crafted with{" "}
                  <span className="text-pride">&hearts;</span> · Built with{" "}
                  <a
                    href="https://next.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Next.ID
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {modalOpen && (
        <ProfilePage
          toNFT={() => {
            setPanelTab(TabsMap.nfts.key);
          }}
          asComponent
          onClose={() => {
            setModalOpen(false);
            setPanelTab(TabsMap.profile.key);
          }}
          overridePanelTab={panelTab}
          onTabChange={(v) => {
            setPanelTab(v);
          }}
          domain={domain}
          overridePlatform={profilePlatform}
        />
      )}
    </div>
  );
}
