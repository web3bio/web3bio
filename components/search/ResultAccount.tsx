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
  const { identityGraph, graphTitle, platform } = props;
  const [open, setOpen] = useState(false);
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  const resolvedListData = (() => {
    if (!identityGraph?.nodes) return [];
    const _identityGraph = JSON.parse(JSON.stringify(identityGraph));
    const _resolved = _identityGraph.nodes
      .filter((x) => x.platform !== PlatformType.ens)
      .map((x) => {
        return {
          ...x,
          profile: profiles.find((i) => i?.uuid === x.uuid),
        };
      });
    const index = _resolved.findIndex((x) => {
      if (platform === PlatformType.ens) {
        return (
          x.displayName === graphTitle && x.platform === PlatformType.ethereum
        );
      }
      return x.identity === graphTitle;
    });
    if (index !== -1) {
      const firstItem = JSON.parse(JSON.stringify(_resolved[index]));
      if (index !== -1) {
        _resolved.splice(index, 1);
        _resolved.unshift(firstItem);
      }
    }

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
              profile={avatar?.profile}
              key={avatar.uuid + idx}
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
          data={{
            nodes: identityGraph.nodes?.map((x) => ({
              ...x,
              profile: profiles.find((i) => i?.uuid === x.uuid),
            })),
            edges: identityGraph.edges,
          }}
          title={graphTitle}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
