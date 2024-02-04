import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROFILE_SOCIAL_GRAPH } from "../../utils/queries";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";

export default function SearchResult({ searchTerm, searchPlatform }) {
  const [querySocialGraph, { loading, error, data }] = useLazyQuery(
    GET_PROFILE_SOCIAL_GRAPH,
    {
      variables: {
        platform: searchPlatform,
        identity: searchTerm,
      },
    }
  );

  const [identityGraph, setIdentityGraph] = useState<any>(null);
  useEffect(() => {
    if (searchTerm && searchPlatform) querySocialGraph();
    if (!data) return;
    setIdentityGraph({
      nodes: data?.socialFollows.identityGraph.vertices || [],
      edges:data?.socialFollows.identityGraph.edges || []
    });
   
  }, [data, searchPlatform, searchTerm, querySocialGraph]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={querySocialGraph} text={error} />;
  if (!data) return <Empty />;

  return (
    <ResultAccount
      identityGraph={identityGraph}
      graphTitle={searchTerm}
    />
  );
}
