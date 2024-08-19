import { memo } from "react";
import { getSourceInfo } from "../utils/source";

export const RenderSourceFooter = ({ sources }) => {
  return (
    (sources?.length > 0 && (
      <div className="social-footer">
        Data sources:
        {sources.map((source) => (
          <span key={source} className="ml-1" title={getSourceInfo(source).description}>
            {getSourceInfo(source).name}
          </span>
        ))}
      </div>
    )) ||
    null
  );
};

export const SourceFooter = memo(RenderSourceFooter);
