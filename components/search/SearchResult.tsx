import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  GET_PROFILE_IDENTITY_GRAPH,
  GET_PROFILE_SOCIAL_GRAPH,
} from "../../utils/queries";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";
import { PlatformType } from "../../utils/platform";

interface ResultNeighbor {
  identity: string;
}
interface IdentityGraph {
  graphId: string;
  vertices: any[];
  edges: any[];
}
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
  const [socialGraph, setSocialGraph] = useState<any>(null);
  useEffect(() => {
    if (searchTerm && searchPlatform) querySocialGraph();
    if (!data) return;
    setIdentityGraph(data.socialFollows.identityGraph);
    const _socialGraph = {
      nodes: new Array(),
      edges: new Array(),
    };
    data.socialFollows.followingTopology.forEach((x) => {
      _socialGraph.nodes.push(x.originalTarget);
      _socialGraph.edges.push({
        source: x.source,
        target: x.target,
        dataSource: x.dataSource,
        type: "following",
      });
      _socialGraph.nodes.push(x.originSource);
    });
    data.socialFollows.followerTopology.forEach((x) => {
      _socialGraph.nodes.push(x.originalTarget);
      _socialGraph.edges.push({
        source: x.source,
        target: x.target,
        dataSource: x.dataSource,
        type: "followed by",
      });
      _socialGraph.nodes.push(x.originSource);
    });
    setSocialGraph(_socialGraph);
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
      socialGraph={socialGraph}
      graphTitle={searchTerm}
    />
  );
}
