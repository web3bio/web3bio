import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { IdentityPanel, TabsMap } from "../components/panel/IdentityPanel";
import { Loading } from "../components/shared/Loading";
import { Error } from "../components/shared/Error";
import { GET_PROFILES_DOMAIN, GET_PROFILES_QUERY } from "../utils/queries";
import { handleSearchPlatform, isDomainSearch } from "../utils/utils";
import { Empty } from "../components/shared/Empty";
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
  const [name, setName] = useState(null);

  const { loading, error, data } = useQuery(
    isDomainSearch(platform) ? GET_PROFILES_DOMAIN : GET_PROFILES_QUERY,
    {
      variables: {
        platform: platform,
        identity: name,
      },
    }
  );

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
  }, [panelTab, domain, router, asComponent, router.query.domain, name]);

  const _identity = (() => {
    if (!data) return null;
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
    <div
      className="web3bio-mask-cover"
      onClick={(event) => {
        const dialog = document.getElementById("nft-dialog");
        console.log(dialog,'dialog')
        if (dialog) return;
        onClose();
      }}
    >
      <div
        className="profile-main"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {loading ? (
          <Loading />
        ) : error ? (
          <Error text={error} />
        ) : !_identity ? (
          <EmptyRender />
        ) : (
          <IdentityPanel
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
      <div className="profile-main">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error text={error} />
        ) : !_identity ? (
          <EmptyRender />
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
            identity={_identity}
          />
        )}
      </div>
    </div>
  );
};

export default memo(RenderDomainPanel);
