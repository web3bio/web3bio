import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
import { IdentityPanel, TabsMap } from "../components/panel/IdentityPanel";
import { Loading } from "../components/shared/Loading";
import { Error } from "../components/shared/Error";
import { GET_PROFILES_DOMAIN, GET_PROFILES_QUERY } from "../utils/queries";
import { handleSearchPlatform, isDomainSearch } from "../utils/utils";
import { Empty } from "../components/shared/Empty";
import { preFetchENSList } from "../utils/ens";
import { PlatformType } from "../utils/type";
import { GET_PROFILE_LENS } from "../utils/lens";
import { LensProfilePanel } from "../components/panel/LensProfilePanel";

const RenderDomainPanel = (props) => {
  const {
    domain,
    asComponent,
    onClose,
    overridePlatform,
    onTabChange,
    overridePanelTab,
    toNFT,
  } = props;
  const router = useRouter();
  const [panelTab, setPanelTab] = useState(
    overridePanelTab || TabsMap.profile.key
  );
  const [platform, setPlatform] = useState(overridePlatform || "ENS");
  const [nftDialogOpen, setNftDialogOpen] = useState(false);
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
      if (nftDialogOpen && !dialog.contains(e.target)) {
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

  const { loading, error, data } = useQuery(
    platform === PlatformType.lens
      ? GET_PROFILE_LENS
      : isDomainSearch(platform)
      ? GET_PROFILES_DOMAIN
      : GET_PROFILES_QUERY,
    platform === PlatformType.lens
      ? {
          variables: {
            handle: domain[0],
          },
          context: {
            uri: process.env.NEXT_PUBLIC_LENS_GRAPHQL_SERVER,
          },
        }
      : {
          variables: {
            platform: platform,
            identity: name,
          },
        }
  );

  console.log(loading, error, data, "lens", name, platform, domain);

  const _identity = (() => {
    if (!data) return null;
    console.log(data, "data");
    if (platform === PlatformType.lens) return data.profile;
    if (isDomainSearch(platform)) {
      if (data.domain) return data.domain.owner;
    }
    return data.identity;
  })();

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
        {loading ? (
          <Loading />
        ) : error ? (
          <Error text={error} />
        ) : !_identity ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
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
        {loading ? (
          <Loading />
        ) : error ? (
          <Error text={error} />
        ) : !_identity ? (
          <EmptyRender />
        ) : platform === PlatformType.lens ? (
          <LensProfilePanel
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
  // todo: get top100 ens
  // const ensList = await getTop1000ENS()
  const paths = preFetchENSList.map((ens) => ({
    params: { domain: [ens] },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const { domain } = params;
  return {
    props: {
      domain,
    },
    revalidate: 10,
  };
}

export default memo(RenderDomainPanel);
