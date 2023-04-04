import { memo } from "react";
import SVG from "react-inlinesvg";
import { SocialPlatformMapping } from "../../utils/platform";

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
          <span key={source} className="mr-1">
            {SocialPlatformMapping(source).label}
          </span>
        ))}
      </div>
    )) ||
    null
  );
};

export const SourceFooter = memo(RenderSourceFooter);
