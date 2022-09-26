import React, { memo, useState } from "react";
import { ResultAccountItem } from "./ResultAccountItem";
import { ResultGraph } from "./ResultGraph";

const RenderAccount = (props) => {
  const { searchTerm, resultNeighbor, graphData } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className="search-result">
      <div className="search-result-header">
        <div className="text-gray">
          Search results for{" "}
          <span className="text-underline">{searchTerm}</span>:
        </div>
        {graphData.length > 0 && (
          <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
            Open Identity Graph
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
      {open && <ResultGraph onClose={() => setOpen(false)} data={graphData} />}
    </div>
  );
};

export const ResultAccount = memo(RenderAccount);
