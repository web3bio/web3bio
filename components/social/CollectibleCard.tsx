import Link from "next/link";
import { memo } from "react";
import { ActivityTypeMapping, formatText, resolveMediaURL } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { RenderIdentity } from "./FeedItem";

const RenderCollectibleCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;
  
  switch (action.type) {
    case ("mint"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action || "default"]}&nbsp;
            <span className="feed-token">
              {metadata.image_url && (
                <NFTAssetPlayer
                  className="feed-token-icon"
                  src={resolveMediaURL(metadata.image_url)}
                  type={"image/png"}
                />
              )}
              {metadata.title || metadata.name}
              {metadata.id && (<small className="feed-token-meta">{`#${formatText(metadata.id)}`}</small>)}
            </span>
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
          {metadata.title && (
            <div className="feed-content">
              <Link
                className="feed-target"
                href={action.related_urls[0]}
                target="_blank"
              >
                <div className="feed-target-name">
                  <strong>
                  {metadata.title}
                  </strong>
                </div>
                <div className="feed-target-content">
                  {metadata.name}
                </div>
                {metadata.image_url && (
                  <div className={`feed-target-content media-gallery`}>
                    <NFTAssetPlayer
                      className="feed-content-img"
                      src={resolveMediaURL(metadata.image_url)}
                      type={"image/png"}
                    />
                  </div>
                )}
              </Link>
            </div>
          )}
        </>
      );
    default:
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
            <span className="feed-token">
              {metadata.title || metadata.name}
              {metadata.id && (<small className="feed-token-meta">{`#${formatText(metadata.id)}`}</small>)}
            </span>
            {ActivityTypeMapping(action.type).prep && (
              <>
                &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
                {RenderIdentity(action.to)}
              </>
            )}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
  }
};

export const CollectibleCard = memo(RenderCollectibleCard);