import React, { memo, useState } from "react";
import { ResultAccountItem } from "./ResultAccountItem";
import { ResultGraph } from "../graph/ResultGraph";
import { formatText } from "../../utils/utils";
import SVG from "react-inlinesvg";

const RenderAccount = (props) => {
  const { searchTerm, resultNeighbor, graphData } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className="search-result">
      <div className="search-result-header">
        <div className="search-result-text text-gray">
          Identity Graph results:
        </div>
        {graphData.length > 0 && (
          <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
            <SVG src="icons/icon-view.svg" width={20} height={20} /> Visualize
          </div>
        )}
      </div>
      <div className="search-result-body">
        {resultNeighbor.length > 0 ? (
          <>
            {resultNeighbor.map((avatar) => (
              <ResultAccountItem
                identity={avatar.identity}
                sources={avatar.sources}
                key={avatar.identity.uuid}
              />
            ))}
          </>
        ) : null}
      </div>
      {open && <ResultGraph onClose={() => setOpen(false)} data={graphData} title={searchTerm} />}
    </div>
  );
};

export const ResultAccount = memo(RenderAccount);
