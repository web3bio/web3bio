import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { IdentityPanel, TabsMap } from "../components/panel/IdentityPanel";
import { Empty } from "../components/shared/Empty";
import { Loading } from "../components/shared/Loading";
import { Error } from "../components/shared/Error";
import { GET_PROFILES_DOMAIN } from "../utils/queries";
import { handleSearchPlatform } from "../utils/utils";

const RenderDomainPanel = (props) => {
  const { domain } = props;
  const router = useRouter();
  const [panelTab, setPanelTab] = useState(TabsMap.profile.key);
  const [platform, setPlatform] = useState("ENS");
  const { loading, error, data } = useQuery(GET_PROFILES_DOMAIN, {
    variables: {
      platform: platform,
      identity: domain && domain[0],
    },
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.domain) return;
    setPlatform(handleSearchPlatform(router.query.domain[0]));
  }, [domain, router.query, router.isReady]);

  return (
    <div className="web3bio-container">
      <div className="web3bio-cover flare"></div>
      <div className="profile-main">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error text={error} />
        ) : !data || !data.domain ? (
          <Empty />
        ) : (
          <IdentityPanel
            curTab={panelTab}
            onTabChange={(v) => {
              router.replace({
                pathname: "",
                query: router.query.s
                  ? {
                      domain: [domain[0], v === TabsMap.profile.key ? null : v],
                      s: router.query.s,
                    }
                  : {
                      domain: [domain[0], v === TabsMap.profile.key ? null : v],
                    },
              });
            }}
            identity={data.domain.owner}
          />
        )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  return {
    fallback: true,
    paths: [],
  };
}

export async function getStaticProps({ params }) {
  const { domain } = params;
  return {
    props: {
      domain,
    },
  };
}
export default memo(RenderDomainPanel);
