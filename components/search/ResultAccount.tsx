import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { ProfileInterface } from "../../utils/profile";
import D3ResultGraph from "../graph/D3ResultGraph";
import { PlatformType } from "../../utils/platform";

// 0: socialGraph 1: identityGraph
const RenderAccount = (props) => {
  const { identityGraph, graphTitle, socialGraph } = props;
  const [open, setOpen] = useState(false);
  const [graphType, setGraphType] = useState(0);

  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  const graphData =
    graphType === 0
      ? socialGraph
      : {
          nodes: identityGraph.vertices,
          edges: identityGraph.edges,
        };

  const resolvedListData = (() => {
    if (!identityGraph) return [];
    const _resolved = identityGraph.vertices.filter(
      (x) => x.platform !== PlatformType.ens.toLocaleLowerCase()
    );
    identityGraph.vertices
      .filter((x) => x.platform === PlatformType.ens.toLocaleLowerCase())
      .forEach((x) => {
        const connection = identityGraph.edges.find((i) => i.target === x.id);
        if (connection) {
          let idx = _resolved.findIndex((i) => i.id === connection.source);
          _resolved[idx] = {
            ..._resolved[idx],
            nfts: _resolved[idx].nfts ? [..._resolved[idx].nfts] : [],
          };
          _resolved[idx].nfts.push(x);
        }
      });
    return _resolved;
  })();
  console.log(graphData,'kkkk')
  return (
    <>
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {/* {socialGraphData.vertices.length > 0 && ( */}
          <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
            <SVG src={"/icons/icon-view.svg"} width={20} height={20} /> Social
            Graph
          </div>
          {/* )} */}
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
          onClose={() => setOpen(false)}
          data={graphData}
          title={graphTitle}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
