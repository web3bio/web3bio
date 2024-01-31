import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROFILE_SOCIAL_GRAPH } from "../../utils/queries";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";
import { PlatformType } from "../../utils/platform";

interface ResultNeighbor {
  identity: string;
}
export default function SearchResult({ searchTerm, searchPlatform }) {
  const [getQuery, { loading, error, data }] = useLazyQuery(
    GET_PROFILE_SOCIAL_GRAPH,
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
    // todo: check this, temp static generation
    const nodes = new Array();
    const edges = new Array();
    data.socialFollows.follower.topology.forEach((x) => {
      nodes.push({
        identity: x.originalSource,
        id: x.source,
        platform: PlatformType.lens,
      });
      nodes.push({
        identity: x.originalTarget,
        id: x.target,
        platform: PlatformType.lens,
      });
      edges.push({
        source: x.source,
        target: x.target,
        label: "followed by",
        dataSource: x.dataSource,
      });
    });
    data.socialFollows.following.topology.forEach((x) => {
      nodes.push({
        identity: x.originalSource,
        id: x.source,
        platform: PlatformType.lens,
      });
      nodes.push({
        identity: x.originalTarget,
        id: x.target,
        platform: PlatformType.lens,
      });
      edges.push({
        source: x.source,
        target: x.target,
        label: "following",
        dataSource: x.dataSource,
      });
    });
    return {
      vertices: nodes,
      edges: edges,
    };
  })();

  return (
    <ResultAccount
      resultNeighbor={resultNeighbor}
      socialGraphData={socialGraphData}
      graphData={data.socialFollows.identityGraph}
      graphTitle={searchTerm}
    />
  );
}
