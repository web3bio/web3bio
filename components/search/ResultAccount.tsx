import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { ProfileInterface } from "../../utils/profile";
import D3ResultGraph from "../graph/D3ResultGraph";

const RenderAccount = (props) => {
  const { graphData, resultNeighbor, graphTitle } = props;
  const [open, setOpen] = useState(false);
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));

  return (
    <>
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {graphData.vertices.length > 0 && (
            <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
              <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
              Visualize
            </div>
          )}
        </div>
        <div className="search-result-body">
          {resultNeighbor?.map((avatar, idx) => (
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
          data={{
            ...graphData,
            vertices: graphData.vertices.reduce((pre, cur) => {
              cur = {
                ...cur,
                profile: profiles?.find((i) => i.uuid === cur.uuid),
              };
              pre.push(cur);
              return pre;
            },[]),
          }}
          title={graphTitle}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
