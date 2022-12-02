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
  const [panelTab, setPanelTab] = useState(TabsMap.feeds.key);
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
    if (router.query.domain[1]) setPanelTab(domain[1]);
  }, [domain, router]);

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
            onTabChange={(v) => {
              router.replace({
                pathname: "",
                query: {
                  domain: [domain[0], v],
                },
              });
              setPanelTab(v);
            }}
            curTab={panelTab}
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
