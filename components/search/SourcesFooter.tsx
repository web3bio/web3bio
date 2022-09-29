import { memo } from "react";
import SVG from "react-inlinesvg";

export const RenderSourceFooter = ({sources}) => {
  return (
    (sources && (
      <div className="social-footer">
        <SVG
          src="icons/icon-sources.svg"
          width={20}
          height={20}
          title="Data sources"
        />
        {sources.map((source) => (
          <span key={source} className="text-uppercase mr-1">
            {source}
          </span>
        ))}
      </div>
    )) ||
    null
  );
};

export const SourceFooter = memo(RenderSourceFooter);
