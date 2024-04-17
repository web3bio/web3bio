import { memo } from "react";
import { SocialPlatformMapping } from "../../utils/platform";

export const RenderSourceFooter = ({ sources }) => {
  return (
    (sources?.length > 0 && (
      <div className="social-footer">
        Data source:
        {sources.map((source) => (
          <span key={source} className="ml-1">
            {SocialPlatformMapping(source).label}
          </span>
        ))}
      </div>
    )) ||
    null
  );
};

export const SourceFooter = memo(RenderSourceFooter);
