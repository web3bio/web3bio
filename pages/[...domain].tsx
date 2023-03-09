import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
import { IdentityPanel, TabsMap } from "../components/panel/IdentityPanel";
import { LensProfilePanel } from "../components/panel/LensProfilePanel";
import { Empty } from "../components/shared/Empty";
import {
  identityProvider,
  nftCollectionProvider, profileProvider
} from "../utils/dataProvider";
import { resolveIdentity } from "../utils/queries";
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
    prefetchingNFTs,
    prefetchingProfile,
  } = props;
  const router = useRouter();
  const [panelTab, setPanelTab] = useState(
    overridePanelTab || TabsMap.profile.key
  );
  const [platform, setPlatform] = useState(overridePlatform || "ENS");
  const [nftDialogOpen, setNftDialogOpen] = useState(false);

  const [name, setName] = useState(null);
  const profileContainer = useRef(null);

  const _identity = (() => {
    if (!identity) return null;
    if (platform === PlatformType.lens) return identity.profile;
    if (isDomainSearch(platform)) {
      if (identity.domain) return identity.domain.owner;
    }
    return identity.identity;
  })();

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
        {!_identity ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
            collections={prefetchingNFTs}
            poaps={prefetchingPoaps}
            onClose={onClose}
            asComponent
            profile={_identity}
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
            identity={_identity}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="web3bio-container">
      <div className="web3bio-cover flare"></div>
      <div ref={profileContainer} className="profile-main">
        {!_identity ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
            collections={prefetchingNFTs}
            poaps={prefetchingPoaps}
            onTabChange={(v) => {
              setPanelTab(v);
              router.replace({
                pathname: "",
                query: {
                  domain: [name, v === TabsMap.profile.key ? "" : v],
                },
              });
            }}
            profile={_identity}
            nftDialogOpen={nftDialogOpen}
            onShowNFTDialog={() => setNftDialogOpen(true)}
            onCloseNFTDialog={() => setNftDialogOpen(false)}
          ></LensProfilePanel>
        ) : (
          <IdentityPanel
            profile={prefetchingProfile}
            collections={prefetchingNFTs}
            poaps={prefetchingPoaps}
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
            identity={_identity}
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
    return {
      params: { domain: [domain.name] },
    };
  });
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { domain } = params;
  let prefetchingPoaps = [];
  let prefetchingNFTs = [];
  let prefetchingProfile = "";
  try {
    const platform = handleSearchPlatform(domain[0]) || "ENS";
    const identity = await identityProvider(platform, domain[0]);
    if (identity) {
      const _resolved = resolveIdentity(identity, platform);
      prefetchingNFTs = await nftCollectionProvider(
        _resolved.identity,
        platform
      );
      prefetchingProfile = await profileProvider(
        _resolved.displayName || _resolved.identity
      );
      // todo: to handle the prefetchingPoaps 403 forbidden
      // prefetchingPoaps = await poapsProvider(_resolved.identity);
    }

    // check the domain whether has a record in supabase, or insert in it
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
        prefetchingNFTs,
        prefetchingProfile,
      },
      revalidate: 600,
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export default memo(RenderDomainPanel);
