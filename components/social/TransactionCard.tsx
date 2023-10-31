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
            {ActivityTypeMapping(action.type).action["default"]} 
            {metadata.tokens.map((x) => RenderToken(x))}
            {" "}{ActivityTypeMapping(action.type).prep}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )} 
          </div>
        </>
      );
    case ("staking"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action]}
            {RenderToken(metadata.token)}
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
            {ActivityTypeMapping(action.type).action["default"]}
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
            {ActivityTypeMapping(action.type).action["default"]}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )} 
          </div>
          {/* <div className="feed-content">
            <div className="feed-target">
              <div className="feed-target-content">
                {metadata.action}
              </div>
            </div>
          </div> */}
        </>
      );
    default:
      return (
        <div className="feed-content">
          {ActivityTypeMapping(action.type).action["default"]}
          {RenderToken(metadata.token || metadata)}
          {ActivityTypeMapping(action.type).prep && (
            <>
              {ActivityTypeMapping(action.type).prep}
              <span className="feed-identity">&nbsp;{formatText(action.to)}</span>
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