import { memo } from "react";
import { ActivityTypeMapping } from "../../utils/utils";
import { RenderToken, RenderIdentity } from "./FeedItem";

const RenderTransactionCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;

  switch (action.type) {
    case ("liquidity"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
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
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
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
            {RenderIdentity(metadata.owner)}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
    case ("deploy"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
            {RenderIdentity(metadata.address)}
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
          {action.to && ActivityTypeMapping(action.type).prep && (
            <>
              &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
              {RenderIdentity(action.to)}
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