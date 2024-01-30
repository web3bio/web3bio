import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROFILES_DOMAIN } from "../../utils/queries";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";

interface ResultNeighbor {
  identity: string;
}
export default function RenderResultDomain({ searchTerm, searchPlatform }) {
  const [getQuery, { loading, error, data }] = useLazyQuery(
    GET_PROFILES_DOMAIN,
    {
      variables: {
        platform: searchPlatform,
        identity: searchTerm,
      },
    }
  );
  const [resultNeighbor, setResultNeighbor] = useState<Array<ResultNeighbor>>(
    []
  );
  useEffect(() => {
    if (searchTerm && searchPlatform) getQuery();
    if (!data) return;
    setResultNeighbor(data.socialFollows.identityGraph.vertices);
  }, [data, searchTerm, searchPlatform, getQuery]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (!data) return <Empty />;
  const socialGraphData = (() => {
    return [];
  })();

  return (
    <ResultAccount
      resultNeighbor={resultNeighbor}
      socialGraph={socialGraphData}
      graphData={data.socialFollows.identityGraph}
      graphTitle={searchTerm}
    />
  );
}
