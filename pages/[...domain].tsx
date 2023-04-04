import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
import { IdentityPanel, TabsMap } from "../components/panel/IdentityPanel";
import { LensProfilePanel } from "../components/panel/LensProfilePanel";
import { Empty } from "../components/shared/Empty";
import { Error } from "../components/shared/Error";
import { Loading } from "../components/shared/Loading";
import { GET_PROFILE_LENS } from "../utils/lens";
import { GET_PROFILES_DOMAIN, GET_PROFILES_QUERY } from "../utils/queries";
import { PlatformType } from "../utils/type";
import { handleSearchPlatform, isDomainSearch } from "../utils/utils";

const RenderDomainPanel = (props) => {
  const {
    domainProp,
    asComponent,
    onClose,
    overridePlatform,
    onTabChange,
    overridePanelTab,
    toNFT,
    // identity,
    // todo: prefetcing Arrays use ssr
    prefetchingPoaps,
    prefetchingNFTs,
    prefetchingProfile,
  } = props;
  const router = useRouter();
  const [panelTab, setPanelTab] = useState(overridePanelTab);
  const [platform, setPlatform] = useState(overridePlatform || "ENS");
  const [domain, setDomain] = useState(domainProp || router.query.domain || []);
  const [identity, setIdentity] = useState(null);
  const [nftDialogOpen, setNftDialogOpen] = useState(false);
  const profileContainer = useRef(null);
  const [fetchIdentity, { loading, error, data, called }] = useLazyQuery(
    platform === PlatformType.lens
      ? GET_PROFILE_LENS
      : isDomainSearch(platform)
      ? GET_PROFILES_DOMAIN
      : GET_PROFILES_QUERY,
    platform === PlatformType.lens
      ? {
          variables: {
            handle: domain[0] || null,
          },
          context: {
            uri: process.env.NEXT_PUBLIC_LENS_GRAPHQL_SERVER,
          },
          fetchPolicy: "cache-and-network",
        }
      : {
          variables: {
            platform: platform,
            identity: domain[0] || null,
          },
          fetchPolicy: "cache-and-network",
        }
  );

  useEffect(() => {
    if (asComponent) {
      setPlatform(handleSearchPlatform(domain[0]));
    } else {
      if (!router.isReady) return;
      if (!router.query.domain) return;
      setDomain(router.query.domain as string[]);
      setPlatform(handleSearchPlatform(router.query.domain[0] || domain[0]));
    }
    if (platform && domain && !called) fetchIdentity();
    const _identity = (() => {
      if (!data || !called) return null;
      if (platform === PlatformType.lens) return data.profile;
      if (isDomainSearch(platform)) {
        if (data.domain) return data.domain.owner;
      }
      return data.identity;
    })();
    setIdentity(_identity);

    const clickEvent = (e) => {
      const dialog = document.getElementById("nft-dialog");
      if (dialog && nftDialogOpen && !dialog.contains(e.target)) {
        if (dialog) setNftDialogOpen(false);
      } else {
        if (profileContainer && !profileContainer.current.contains(e.target)) {
          if (!asComponent) return;
          onClose();
        }
      }
    };
    window.document.addEventListener("mousedown", clickEvent);
    return () => window.document.removeEventListener("mousedown", clickEvent);
  }, [panelTab, domain, router, asComponent, platform, nftDialogOpen, data]);

  useEffect(() => {
    if (asComponent || !identity) return;
    const setPanelTabFromURL = () => {
      if (!window) return;
      const url = window.location.href;
      const paramsArr = url.split("/");
      const paramsTab = paramsArr[paramsArr.length - 1];
      if (Object.keys(TabsMap).includes(paramsTab)) {
        setPanelTab(paramsTab);
      } else {
        setPanelTab(TabsMap.profile.key);
      }
    };
    window.history.pushState(
      {},
      "",
      `/${domain[0]}${
        !panelTab || panelTab === TabsMap.profile.key ? "" : `/${panelTab}`
      }`
    );
    window.addEventListener("popstate", setPanelTabFromURL, false);
    return () =>
      window.removeEventListener("popstate", setPanelTabFromURL, false);
  }, [panelTab, identity, asComponent]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.domain) return;
    if (router.query.domain.length > 1) {
      setPanelTab(router.query.domain[1]);
    } else {
      setPanelTab(TabsMap.profile.key);
    }
  }, [router.isReady, router.query.domain]);
  const EmptyRender = () => {
    return (
      <div className="identity-panel">
        <div className="panel-container">
          <Empty />
        </div>
      </div>
    );
  };

  return asComponent ? (
    <div className="web3bio-mask-cover">
      <div ref={profileContainer} className="profile-main">
        {loading || !called ? (
          <Loading />
        ) : error ? (
          <Error retry={fetchIdentity} text={error} />
        ) : !identity && called ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
            collections={prefetchingNFTs}
            poaps={prefetchingPoaps}
            onClose={onClose}
            asComponent
            profile={identity}
            curTab={panelTab}
            onTabChange={onTabChange}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
          ></LensProfilePanel>
        ) : (
          <IdentityPanel
            profile={prefetchingProfile}
            collections={prefetchingNFTs}
            poaps={prefetchingPoaps}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
            nftDialogOpen={nftDialogOpen}
            toNFT={toNFT}
            asComponent
            onClose={onClose}
            curTab={panelTab}
            onTabChange={onTabChange}
            identity={identity}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="web3bio-container">
      <div className="web3bio-cover flare"></div>
      <div ref={profileContainer} className="profile-main">
        {loading || !called ? (
          <Loading />
        ) : error ? (
          <Error retry={fetchIdentity} text={error} />
        ) : !identity && called ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
            poaps={prefetchingPoaps}
            onTabChange={(v) => {
              setPanelTab(v);
            }}
            curTab={panelTab}
            profile={identity}
            nftDialogOpen={nftDialogOpen}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
          ></LensProfilePanel>
        ) : (
          <IdentityPanel
            profile={prefetchingProfile}
            poaps={prefetchingPoaps}
            curTab={panelTab}
            toNFT={() => {
              setPanelTab(TabsMap.nfts.key);
            }}
            onTabChange={(v) => {
              setPanelTab(v);
            }}
            nftDialogOpen={nftDialogOpen}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
            identity={identity}
          />
        )}
      </div>
    </div>
  );
};

export default memo(RenderDomainPanel);
