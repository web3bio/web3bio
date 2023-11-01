import { memo } from "react";
import { ActivityTypeMapping } from "../../utils/utils";

const RenderDefaultCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;

  return (
    <>
      <div className="feed-content">
        {ActivityTypeMapping(action.type).action[metadata.action||"default"]}
        {action.platform && (
          <span className="feed-platform">&nbsp;on {action.platform}</span>
        )} 
      </div>
    </>
  );
};

export const DefaultCard = memo(RenderDefaultCard);