import React, { useState } from "react";
import { ResultAccountItem } from "./ResultAccountItem";
import { ResultGraph } from "./ResultGraph";

export function ResultAccount(props) {
  const { searchTerm, resultNeighbor } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className="search-result">
      <div className="search-result-header">
        <div className="text-gray">
          Search results for{" "}
          <span className="text-underline">{searchTerm}</span>:
        </div>
        <div className="btn" onClick={() => setOpen(true)}>
          Graph
        </div>
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
      {open && <ResultGraph onClose={() => setOpen(false)} />}
    </div>
  );
}
