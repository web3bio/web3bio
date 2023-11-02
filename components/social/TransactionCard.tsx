import { memo } from "react";
import { ActivityTypeMapping, formatText } from "../../utils/utils";
import { RenderToken } from "./FeedItem";

const RenderTransactionCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;

  switch (action.type) {
    case ("liquidity"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action["default"]} &nbsp;
            {metadata.tokens.map((x) => RenderToken(x))}
            {" "}{ActivityTypeMapping(action.type).prep}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )} 
          </div>
        </>
      );
    case ("swap"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action["default"]}&nbsp;
            {RenderToken(metadata.from)}
            &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
            {RenderToken(metadata.to)}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )} 
          </div>
        </>
      );
    case ("multisig"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action || "default"]}&nbsp;
            {metadata.owner && (`<span className="feed-token">${formatText(metadata.owner)}</span>`)}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
    default:
      return (
        <div className="feed-content">
          {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
          {RenderToken(metadata.token || metadata)}
          {ActivityTypeMapping(action.type).prep && (
            <>
              &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
              <span className="feed-token">{formatText(action.to)}</span>
            </>
          )}
          {action.platform && (
            <span className="feed-platform">&nbsp;on {action.platform}</span>
          )}
          
        </div>
      );
  }
};

export const TransactionCard = memo(RenderTransactionCard);