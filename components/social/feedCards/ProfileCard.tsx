import { memo, useMemo } from "react";
import { formatText, isSameAddress, resolveMediaURL } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

export function isProfileFeed(feed) {
  return (
    feed.tag === Tag.Social &&
    [Type.Profile, Type.Follow, Type.Mint].includes(feed.type)
  );
}

const RenderProfileFeed = (props) => {
  const { feed, name, address } = props;

  const isOwner = isSameAddress(feed.owner, address);
  const { metadata, summary, image_url } = useMemo(() => {
    let action;
    let metadata;
    let image_url;

    switch (feed.type) {
      case Type.Mint:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url =resolveMediaURL( metadata.media?.[0]?.address);
        return {
          metadata,
          action,
          image_url,
          summary: (
            <>
              Minted a note on <strong>{action.platform}</strong>
            </>
          ),
        };
      case Type.Follow:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.profile_uri?.[0] || metadata.image_url;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <>
              Followed
              <strong>{metadata.name || metadata.handle}</strong>
              on <strong>{metadata.platform}</strong>
            </>
          ),
        };
    }

    return { summary: "", image_url };
  }, [feed, isOwner, name, address]);
  return (
    <div className="feed-item-body">
      <div className="feed-content">
        <div className="feed-content-header">{summary}</div>

        {metadata && (
          <div className={"feed-content"}>
           {image_url &&  <NFTAssetPlayer
              className="feed-content-img"
              src={image_url}
              type="image/png"
              alt={metadata.handle}
            />}
            <div className="feed-content-target">
              <div className="feed-target-name">
                {metadata.name || metadata.handle}
              </div>
              <div className="feed-target-content">{metadata.body}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileCard = memo(RenderProfileFeed);
