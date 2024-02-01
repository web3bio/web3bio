import { memo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { ProfileInterface } from "../../utils/profile";
import D3ResultGraph from "../graph/D3ResultGraph";
import { PlatformType } from "../../utils/platform";
import { useLazyQuery } from "@apollo/client";
import { GET_PROFILE_IDENTITY_GRAPH } from "../../utils/queries";

// 0: socialGraph 1: identityGraph
const RenderAccount = (props) => {
  const { identityGraph, graphTitle, socialGraph } = props;
  const [open, setOpen] = useState(false);
  const [graphType, setGraphType] = useState(0);
  const [graphId, setGraphId] = useState("");
  const [title, setTitle] = useState(graphTitle);

  const [identityGraphData, setIdentityGraphData] = useState({
    nodes: identityGraph?.vertices,
    edges: identityGraph?.edges,
  });

  const [queryIdentityGraph, { loading, error, data }] = useLazyQuery(
    GET_PROFILE_IDENTITY_GRAPH,
    {
      variables: {
        graphId: graphId,
      },
    }
  );

  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  const graphData = graphType === 0 ? socialGraph : identityGraphData;

  const resolvedListData = (() => {
    if (!identityGraph) return [];
    const _resolved = identityGraph.vertices.filter(
      (x) => x.platform !== PlatformType.ens
    );
    identityGraph.vertices
      .filter((x) => x.platform === PlatformType.ens)
      .forEach((x) => {
        const connection = identityGraph.edges.find(
          (i) => i.target === x.id || i.source === x.id
        );
        const isDuplicated = _resolved
          .filter((x) => x.platform === PlatformType.ethereum)
          .find((i) => i.displayName === x.identity);
        if (connection && !isDuplicated) {
          let idx = _resolved.findIndex(
            (i) => i.id === connection.source || i.id === connection.target
          );
          _resolved[idx] = {
            ..._resolved[idx],
            nfts: _resolved[idx].nfts ? [..._resolved[idx].nfts] : [],
          };
          _resolved[idx].nfts.push(x);
        }
      });
    return _resolved;
  })();
  useEffect(() => {
    if (graphId) {
      queryIdentityGraph();
      if (!data || !data?.queryIdentityGraph?.length) return;
      setIdentityGraphData({
        nodes: data.queryIdentityGraph[0].vertices,
        edges: data.queryIdentityGraph[0].edges,
      });
      setGraphType(1);
      setGraphId("");
    }
  }, [graphId, data, queryIdentityGraph]);
  return (
    <>
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {socialGraph?.nodes.length > 0 && (
            <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
              <SVG src={"/icons/icon-view.svg"} width={20} height={20} /> Social
              Graph
            </div>
          )}
        </div>
        <div className="search-result-body">
          {resolvedListData.map((avatar, idx) => (
            <ResultAccountItem
              identity={avatar}
              sources={["nextid"]}
              profile={profiles.find((x) => x?.uuid === avatar.uuid)}
              key={avatar.id + idx}
            />
          ))}
        </div>
      </div>
      {open && (
        <D3ResultGraph
          graphType={graphType}
          expandIdentity={(identity) => {
            setGraphId(identity.id);
            setTitle(identity.displayName);
          }}
          back={() => {
            setGraphType(0);
            setTitle(graphTitle);
          }}
          onClose={() => setOpen(false)}
          data={graphData}
          title={title}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
