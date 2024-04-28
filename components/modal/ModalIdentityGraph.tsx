"use client";
import { useEffect, useState } from "react";
import D3IdentityGraph from "../graph/D3IdentityGraph";
import D3SocialGraph from "../graph/D3SocialGraph";
import { useLazyQuery } from "@apollo/client";
import { GET_SOCIAL_GRAPH, QUERY_IDENTITY_GRAPH } from "../utils/queries";
import { GraphType } from "../graph/utils";
import Loading from "../../app/[domain]/loading";
import { useSelector } from "react-redux";
import { AppState } from "../state";
import { ProfileInterface } from "../utils/profile";
import _ from "lodash";

export default function IdentityGraphModalContent(props) {
  const { type, domain, platform } = props;
  const [offset, setOffset] = useState(0);
  const [graphType, setGraphType] = useState(type);
  const [rootNode, setRootNode] = useState<any>(null);
  const [graphData, setGraphData] = useState(new Array());
  const [graphId, setGraphId] = useState("");
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  // const [identityGraph,setIdentityGraph] = useState(null)
  const [querySocial, { loading, data: socialGraph }] = useLazyQuery(
    GET_SOCIAL_GRAPH,
    {
      variables: {
        platform: platform,
        identity: domain?.endsWith(".farcaster")
          ? domain?.replace(".farcaster", "")
          : domain,
        offset: offset,
      },
    }
  );
  const [
    queryIdentity,
    { loading: identityGraphLoading, data: identityGraph },
  ] = useLazyQuery(QUERY_IDENTITY_GRAPH, {
    variables: {
      graphId: graphId,
    },
  });
  useEffect(() => {
    if (type === GraphType.socialGraph) {
      querySocial();
    }
    if (graphId) {
      queryIdentity();
    }
    if (socialGraph?.relation?.follow?.relation) {
      const _arr = JSON.parse(JSON.stringify(graphData));
      socialGraph?.relation?.follow?.relation.forEach((x) => {
        if (
          !_arr.includes((i) => i.source === x.source && i.target === x.target)
        ) {
          _arr.push(x);
        }
      });
      setGraphData(_arr);
    }
  }, [type, offset, graphId, identityGraph, socialGraph]);
  return graphType === 0 ? (
    identityGraphLoading ||
    (!identityGraph?.identityGraph?.[0]?.vertices.length && !props.data) ? (
      <Loading />
    ) : (
      <D3IdentityGraph
        {...props}
        title={rootNode?.identity}
        onBack={() => setGraphType(GraphType.socialGraph)}
        data={
          props.data || {
            nodes: identityGraph?.identityGraph?.[0]?.vertices.map((x) => ({
              ...x,
              profile: profiles.find((i) => i?.uuid === x?.uuid),
            })),
            edges: identityGraph?.identityGraph?.[0]?.edges,
          }
        }
        root={rootNode}
      />
    )
  ) : loading && !graphData?.length ? (
    <Loading />
  ) : (
    <D3SocialGraph
      {...props}
      onExpand={(i) => {
        setGraphId(i.graphId);
        setRootNode(i);
        setGraphType(GraphType.identityGraph);
      }}
      domain={domain}
      onExtend={() => setOffset(offset + 1)}
      data={graphData?.length > 0 ? graphData : null}
      title={domain}
    />
  );
}
