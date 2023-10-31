import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ActivityTypeMapping, formatText } from "../../utils/utils";
import { RenderToken } from "./FeedItem";

const RenderExchangeCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;

  switch (action.type) {
    case ("swap"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action["default"]}
            {RenderToken(metadata.from)}
            {" "}{ActivityTypeMapping(action.type).prep}{" "}
            {RenderToken(metadata.to)}
            {action.platform && (
              <span className="feed-platform">{" "}on {action.platform}</span>
            )} 
          </div>
        </>
      );
    case ("liquidity"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action["default"]} 
            {metadata.tokens.map((x) => RenderToken(x))}
            {" "}{ActivityTypeMapping(action.type).prep}
            {action.platform && (
              <span className="feed-platform">{" "}on {action.platform}</span>
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
              <span className="feed-platform">on {action.platform}</span>
            )} 
          </div>
        </>
      );
    default:
      return (
        <div className="feed-content">
          {ActivityTypeMapping(action.type).action["default"]}
          {RenderToken(metadata)}
          {ActivityTypeMapping(action.type).prep && (
            <>
              {" "}{ActivityTypeMapping(action.type).prep}
              <span className="feed-identity">{" "}{formatText(action.to)}</span>
            </>
          )}
        </div>
      );
  }
};

export const ExchangeCard = memo(RenderExchangeCard);