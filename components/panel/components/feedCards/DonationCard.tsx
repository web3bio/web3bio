import { memo, useState } from "react";
import {
  formatText,
  formatValue,
  isSameAddress,
} from "../../../../utils/utils";
import { Tag } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";

export function isDonationFeed(feed) {
  return feed.tag === Tag.Donation;
}

const RenderDonationCard = (props) => {
  const { feed, actionIndex, identity, name } = props;
  const [index, setIndex] = useState(0);
  const activeActionIndex = actionIndex ?? index;
  const action = feed.actions[activeActionIndex];
  const metadata = action.metadata;
  const owner = identity.address;
  const isOwner = isSameAddress(feed.owner, owner);

  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">💌</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">
              {isOwner ? name || formatText(owner) : formatText(owner ?? "")}
            </div>
            donated
            <div className="strong">
              {formatValue(metadata?.token)} {metadata?.token?.symbol ?? ""} on{" "}
              {feed.platform}
            </div>
          </div>
        </div>

        {metadata && (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              width={"100%"}
              height={"100%"}
              className="feed-nft-img"
              src={metadata.token.image}
            />
            <picture></picture>
            <div className="feed-nft-info">
              <div className="nft-title">{metadata.title}</div>
              <div className="nft-subtitle">{metadata.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DonationCard = memo(RenderDonationCard);
