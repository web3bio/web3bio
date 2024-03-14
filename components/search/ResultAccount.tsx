import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { ProfileInterface } from "../../utils/profile";
import { PlatformType } from "../../utils/platform";
import D3ResultGraph from "../graph/D3ResultGraph";

const RenderAccount = (props) => {
  const { identityGraph, graphTitle } = props;
  const [open, setOpen] = useState(false);
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  const resolvedListData = (() => {
    if (!identityGraph) return [];
    const _identityGraph = JSON.parse(JSON.stringify(identityGraph));
    console.log(_identityGraph,'kkkk')
    const _resolved = _identityGraph.nodes.filter(
      (x) => x.platform !== PlatformType.ens
    );
    _identityGraph.nodes
      .filter((x) => x.platform === PlatformType.ens)
      .forEach((x) => {
        const connection = _identityGraph.edges.find(
          (i) => i.target === x.id || i.source === x.id
        );

        if (connection) {
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
  return (
    <>
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {identityGraph?.nodes.length > 0 && (
            <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
              <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
              Identity Graph
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
          onClose={() => {
            setOpen(false);
          }}
          disableBack
          data={identityGraph}
          title={graphTitle}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
