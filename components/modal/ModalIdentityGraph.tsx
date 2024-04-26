"use client";
import { useEffect, useState } from "react";
import D3IdentityGraph from "../graph/D3IdentityGraph";
import D3SocialGraph from "../graph/D3SocialGraph";
import { useLazyQuery } from "@apollo/client";
import { GET_SOCIAL_GRAPH, QUERY_IDENTITY_GRAPH } from "../utils/queries";
import { Loading } from "../shared/Loading";
import { GraphType } from "../graph/utils";

export default function IdentityGraphModalContent(props) {
  const { type, domain, platform } = props;
  const [offset, setOffset] = useState(0);
  const [graphType, setGraphType] = useState(type);
  const [graphData, setGraphData] = useState(new Array());
  const [graphId, setGraphId] = useState("");
  // const [identityGraph,setIdentityGraph] = useState(null)
  const [querySocial, { loading, data: socialGraph }] = useLazyQuery(
    GET_SOCIAL_GRAPH,
    {
      variables: {
        platform: platform,
        identity: domain.endsWith(".farcaster")
          ? domain.replace(".farcaster", "")
          : domain,
        offset: offset,
      },
    }
  );
  const [queryIdentity, { data: identityGraph }] = useLazyQuery(
    QUERY_IDENTITY_GRAPH,
    {
      variables: {
        graphId: graphId,
      },
    }
  );
  useEffect(() => {
    if (type === GraphType.socialGraph) {
      querySocial();
    }
    if (graphId) {
      queryIdentity();
    }
    if (identityGraph) {
      console.log(identityGraph,'kkk')
      setGraphType(GraphType.identityGraph);
    }
  }, [type, offset, graphId, identityGraph]);
  return type === 0 ? (
    <D3IdentityGraph data={identityGraph || props.data} {...props} />
  ) : loading ? (
    <Loading />
  ) : (
    <D3SocialGraph
      onExpand={setGraphId}
      domain={domain}
      onExtend={() => setOffset(offset + 1)}
      data={socialGraph}
      {...props}
    />
  );
}
