import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
import { IdentityPanel, TabsMap } from "../components/panel/IdentityPanel";
import { LensProfilePanel } from "../components/panel/LensProfilePanel";
import { Empty } from "../components/shared/Empty";
import { identityProvider, poapsProvider } from "../utils/dataProvider";
import { _identity } from "../utils/queries";
import { DOMAINS_TABLE_NAME, supabase } from "../utils/supabase";
import { PlatformType } from "../utils/type";
import { handleSearchPlatform, isDomainSearch } from "../utils/utils";

const RenderDomainPanel = (props) => {
  const {
    domain,
    asComponent,
    onClose,
    overridePlatform,
    onTabChange,
    overridePanelTab,
    toNFT,
    identity,
    prefetchingPoaps,
  } = props;
  const router = useRouter();
  const [panelTab, setPanelTab] = useState(
    overridePanelTab || TabsMap.profile.key
  );
  const [platform, setPlatform] = useState(overridePlatform || "ENS");
  const [nftDialogOpen, setNftDialogOpen] = useState(false);
  const [poaps, setPoaps] = useState(prefetchingPoaps || []);
  const [name, setName] = useState(null);
  const profileContainer = useRef(null);
  
  useEffect(() => {
    if (asComponent) {
      setName(domain[0]);
      setPlatform(handleSearchPlatform(name));
    } else {
      if (!router.isReady) return;
      if (!router.query.domain) return;
      const _domain = domain ?? router.query.domain;
      setName(_domain[0]);
      setPlatform(handleSearchPlatform(_domain[0]));
      if (_domain[1]) setPanelTab(_domain[1]);
    }

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
  }, [
    panelTab,
    domain,
    router,
    asComponent,
    router.query.domain,
    name,
    nftDialogOpen,
    onClose,
  ]);

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
        {!_identity(identity, platform) ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
            poaps={poaps}
            onClose={onClose}
            asComponent
            profile={_identity(identity, platform)}
            curTab={panelTab}
            onTabChange={onTabChange}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
          ></LensProfilePanel>
        ) : (
          <IdentityPanel
            poaps={poaps}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
            nftDialogOpen={nftDialogOpen}
            toNFT={toNFT}
            asComponent
            onClose={onClose}
            curTab={panelTab}
            onTabChange={onTabChange}
            identity={_identity(identity, platform)}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="web3bio-container">
      <div className="web3bio-cover flare"></div>
      <div ref={profileContainer} className="profile-main">
        {_identity(identity, platform) ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
            poaps={poaps}
            onTabChange={(v) => {
              setPanelTab(v);
              router.replace({
                pathname: "",
                query: {
                  domain: [name, v === TabsMap.profile.key ? "" : v],
                },
              });
            }}
            profile={_identity(identity, platform)}
            nftDialogOpen={nftDialogOpen}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
          ></LensProfilePanel>
        ) : (
          <IdentityPanel
            poaps={poaps}
            curTab={panelTab}
            toNFT={() => {
              setPanelTab(TabsMap.nfts.key);
            }}
            onTabChange={(v) => {
              setPanelTab(v);
              router.replace({
                pathname: "",
                query: {
                  domain: [name, v === TabsMap.profile.key ? "" : v],
                },
              });
            }}
            nftDialogOpen={nftDialogOpen}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
            identity={_identity(identity, platform)}
          />
        )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const { data: prefetching_domains } = await supabase
    .from(DOMAINS_TABLE_NAME)
    .select("name");
  const paths = (prefetching_domains || []).map((domain) => {
    console.log("Generate Static Page:", domain.name);
    return {
      params: { domain: [domain.name] },
    };
  });
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { domain } = params;
  let prefetchingPoaps = [];
  const platform = handleSearchPlatform(domain[0]) || "ENS";
  const identity = await identityProvider(platform, domain[0]);
  if (identity) {
    const _resolved = _identity(identity,platform)
    prefetchingPoaps = await poapsProvider(_resolved.identity)
  }
  const { data: prefetching_domains } = await supabase
    .from(DOMAINS_TABLE_NAME)
    .select("name");
  if (
    !prefetching_domains.map((x) => x.name).includes(domain) &&
    isDomainSearch(domain)
  ) {
    const { error } = await supabase.from(DOMAINS_TABLE_NAME).insert([
      {
        id: prefetching_domains.length,
        name: domain,
        created_at: Date.now().toLocaleString(),
      },
    ]);

    if (error) {
      console.log("insert unknown identifier failed");
    } else {
      console.log(
        `insert unknown identifier: ${domain} success! see supabase for more information`
      );
    }
  }

  return {
    props: {
      identity,
      domain,
      prefetchingPoaps,
    },
    revalidate: 600,
  };
}

export default memo(RenderDomainPanel);
