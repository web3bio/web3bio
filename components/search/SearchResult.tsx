import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";
import { GET_PROFILES } from "../../utils/queries";

export default function SearchResult({ searchTerm, searchPlatform }) {
  const [getQuery, { loading, error, data }] = useLazyQuery(GET_PROFILES, {
    variables: {
      platform: searchPlatform,
      identity: searchTerm,
    },
  });
  const [identityGraphData, setIdentityGraphData] = useState({
    vertices:[],
    edges:[]
  });

  useEffect(() => {
    if (searchPlatform && searchTerm) {
      getQuery();
    }
    if (!data || !data.identity) return;
    setIdentityGraphData(data.identity.identityGraph);
  }, [data, searchPlatform, searchTerm, getQuery]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (!data?.identity) return <Empty />;

  return (
    <ResultAccount identityGraph={{
      nodes:identityGraphData.vertices,
      edges: identityGraphData.edges,
    }} graphTitle={searchTerm} />
  );
}
