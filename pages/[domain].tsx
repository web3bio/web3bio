import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { IdentityPanel } from "../components/panel/IdentityPanel";
import { Empty } from "../components/shared/Empty";
import { Loading } from "../components/shared/Loading";
import { Error } from "../components/shared/Error";
import { GET_PROFILES_DOMAIN } from "../utils/queries";
import { handlesearchPlatform } from "../utils/utils";

const RenderDomainPanel = (props) => {
  const { domain } = props;
  const router = useRouter();
  const [panelTab, setPanelTab] = useState();
  const [platform, setPlatform] = useState("ENS");
  const { loading, error, data } = useQuery(GET_PROFILES_DOMAIN, {
    variables: {
      platform: platform,
      identity: domain,
    },
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.domain) return;
    setPlatform(handlesearchPlatform(router.query.domain));
  }, [router]);

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
                  s: router.query.s,
                  d: router.query.d,
                  t: v,
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
