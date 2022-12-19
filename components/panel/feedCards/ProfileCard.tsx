import { memo } from "react";
import { formatText, isSameAddress } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

export function isProfileFeed(feed) {
  return feed.tag === Tag.Social && feed.type === Type.Profile;
}

const RenderProfileFeed = (props) => {
  const { feed, identity } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;
  const imageSize = 40;
  const isOwner = isSameAddress(feed.owner, identity.identity);
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">
              {isOwner
                ? identity.displayName ?? formatText(identity.identity)
                : formatText(feed.owner ?? "")}
            </div>
            created an profile on
            <div className="strong">{metadata?.platform}</div>
          </div>
        </div>

        {metadata && (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              className="feed-nft-img"
              width={imageSize}
              height={imageSize}
              src={metadata.profile_uri[0]}
              type="image/png"
            />
            <div className="feed-nft-info">
              <div className="nft-title">
                {metadata.name || metadata.handle}
              </div>
              <div className="nft-subtitle">{metadata?.bio}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProfileCard = memo(RenderProfileFeed);
