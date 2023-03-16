import { memo } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";

const RenderAccount = (props) => {
  const { openGraph, resultNeighbor, graphData, openProfile } = props;

  return (
    <div className="search-result">
      <div className="search-result-header">
        <div className="search-result-text text-gray">
          Identity Graph results:
        </div>
        {graphData.length > 0 && (
          <div className="btn btn-link btn-sm" onClick={openGraph}>
            <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
            Visualize
          </div>
        )}
      </div>
      <div className="search-result-body">
        {resultNeighbor.length > 0 ? (
          <>
            {resultNeighbor.map((avatar) => (
              <ResultAccountItem
                onItemClick={openProfile}
                identity={avatar.identity}
                sources={avatar.sources}
                key={avatar.identity.uuid}
              />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

export const ResultAccount = memo(RenderAccount);
