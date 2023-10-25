import { memo, useMemo } from "react";
import {
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../../../utils/utils";
import { CardType, Tag, Type } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

export function isProfileFeed(feed) {
  return (
    feed.tag === Tag.Social &&
    [Type.Profile, Type.Follow, Type.Mint].includes(feed.type)
  );
}

const RenderProfileFeed = (props) => {
  const { feed, identity, name } = props;

  const owner = identity.address;
  const isOwner = isSameAddress(feed.owner, owner);
  const { metadata, summary, image_url } = useMemo(() => {
    let action;
    let metadata;
    let image_url;
    const _from = isOwner ? name : formatText(owner ?? "");
    const _to = isSameAddress(owner, feed.to)
      ? name || formatText(owner)
      : formatText(feed.to ?? "");
    switch (feed.type) {
      case Type.Mint:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.media?.[0]?.address;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{_from}</div>
              minted a note on <div className="strong">{action.platform}</div>
            </div>
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
            <div className="feed-type-intro">
              <div className="strong">{_from}</div>
              followed
              <div className="strong">{metadata.name || metadata.handle}</div>
              on <div className="strong">{metadata.platform}</div>
            </div>
          ),
        };
    }

    return { summary: "", image_url };
  }, [feed, isOwner, name, owner]);
  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">🚀</div>
      <div className="feed-item">
        <div className="feed-item-header">{summary}</div>

        {metadata && (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              className="feed-nft-img"
              src={image_url}
              type="image/png"
              alt={metadata.handle}
            />
            <div className="feed-nft-info">
              <div className="nft-title">
                {metadata.name || metadata.handle}
              </div>
              <div className="nft-subtitle">{metadata.body}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileCard = memo(RenderProfileFeed);
