import { memo } from "react";
import { formatText, isSameAddress } from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";

export function isProfileFeed(feed) {
  return feed.tag === Tag.Social && feed.type === Type.Profile;
}

const RenderProfileFeed = (props) => {
  const { feed, identity, name } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;
  const owner = identity.address;
  const isOwner = isSameAddress(feed.owner, owner);
  
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">
              {isOwner
                ? name || formatText(owner)
                : formatText(feed.owner ?? "")}
            </div>
            updated an profile on
            <div className="strong">{feed?.platform}</div>
          </div>
        </div>

        {metadata && (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              className="feed-nft-img"
              src={metadata.image_uri}
              type="image/png"
              alt={metadata.handle}
            />
            <div className="feed-nft-info">
              <div className="nft-title">
                {metadata.name || metadata.handle}
              </div>
              <div className="nft-subtitle">
                <strong>{metadata?.action + " "}</strong>{" "}
                {metadata?.key + " " + formatText(metadata?.value)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileCard = memo(RenderProfileFeed);
