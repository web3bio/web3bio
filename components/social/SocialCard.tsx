import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { ActivityTypeMapping, resolveMediaURL } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderSocialCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;
  
  switch (action.type) {
    case ("profile"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
            <span className="feed-token">{metadata.handle}</span>
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )} 
          </div>
          {metadata.key && (
            <div className="feed-content">
              <Link
                className="feed-target"
                href={`https://web3.bio/${metadata.handle}`}
                target="_blank"
              >
                <div className="feed-target-name">
                  <strong>
                  {metadata.key}
                  </strong>
                </div>
                <div className="feed-target-content">
                  {metadata.value}
                </div>
              </Link>
            </div>
          )}
        </>
      );
    case ("post"):
    case ("comment"):
      if (["Farcaster", "Lens"].includes(action.platform)) {
        return (
          <>
            {metadata?.body && (
              <div className="feed-content text-large">
                {metadata?.body}
              </div>
            )}
            {metadata?.media?.length > 0 && (
              <div className={`feed-content${metadata.media.length > 1 ? " media-gallery" : ""}`}>
                {metadata.media?.map((x) => 
                  (x.mime_type.includes("image") ? 
                    <NFTAssetPlayer
                      className="feed-content-img"
                      src={resolveMediaURL(x.address)}
                      type={x.mime_type}
                      key={x.address}
                    /> : "")
                )}
              </div>
            )}
            {metadata.target && (
              <div className="feed-content">
                <Link
                  className="feed-target"
                  href={resolveIPFS_URL(metadata.target_url) || ""}
                  target="_blank"
                >
                  <div className="feed-target-name">
                    <strong>
                      {metadata.target?.handle}
                    </strong>
                  </div>
                  <div className="feed-target-content">
                    {metadata.target?.body}
                  </div>
                  {metadata.target?.media?.length > 0 && (
                    <div className={`feed-target-content media-gallery`}>
                      {metadata.target?.media?.map((x) => 
                        (x.mime_type.includes("image") ? 
                          <NFTAssetPlayer
                            className="feed-content-img"
                            src={resolveMediaURL(x.address)}
                            type={x.mime_type}
                            key={x.address}
                          /> : "")
                      )}
                    </div>
                  )}
                </Link>
              </div>
            )}
          </>
        );
      } else {
        return (
          <>
            <div className="feed-content">
              {ActivityTypeMapping(action.type).action[metadata.action||"default"]}
              {action.platform && (
                <span className="feed-platform">&nbsp;on {action.platform}</span>
              )} 
            </div>
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
                  {metadata.summary || metadata.body}
                </div>
              </Link>
            </div>
          </>
        );
      };
    case ("mint"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action["post"]}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )} 
          </div>
          <div className="feed-content">
            <Link
              className="feed-target"
              href={action.related_urls[0]}
              target="_blank"
            >
              <div className="feed-target-name">
                <strong>
                  {metadata.handle}
                </strong>
              </div>
              <div className="feed-target-content">
                {metadata.body}
              </div>
              {metadata.media?.length > 0 && (
                <div className={`feed-target-content media-gallery`}>
                  {metadata.media?.map((x) => (
                    (x.mime_type.includes("image") ? 
                      <NFTAssetPlayer
                        className="feed-content-img"
                        src={resolveMediaURL(x.address)}
                        type={x.mime_type}
                        key={x.address}
                      /> : "")
                  ))}
                </div>
              )}
            </Link>
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )} 
          </div>
          {metadata.target && (
            <div className="feed-content">
              <Link
                className="feed-target"
                href={resolveIPFS_URL(metadata.target_url) || ""}
                target="_blank"
              >
                <div className="feed-target-name">
                  <strong>
                    {metadata.target?.handle}
                  </strong>
                </div>
                <div className="feed-target-content">
                  {metadata.target?.body}
                </div>
                {metadata.target?.media?.length > 0 && (
                  <div className={`feed-target-content media-gallery`}>
                    {metadata.target?.media?.map((x) => 
                      (x.mime_type.includes("image") ? 
                        <NFTAssetPlayer
                          className="feed-content-img"
                          src={resolveMediaURL(x.address)}
                          type={x.mime_type}
                          key={x.address}
                        /> : "")
                    )}
                  </div>
                )}
              </Link>
            </div>
          )}
        </>
      );
  }
};

export const SocialCard = memo(RenderSocialCard);