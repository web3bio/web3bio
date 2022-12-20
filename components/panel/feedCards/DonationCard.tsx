import { memo, useState } from "react";
import { formatText, formatValue, isSameAddress } from "../../../utils/utils";
import { Tag } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

export function isDonationFeed(feed) {
  return feed.tag === Tag.Donation;
}

const RenderDonationCard = (props) => {
  const { feed, identity, actionIndex } = props;
  const [index, setIndex] = useState(0);
  const activeActionIndex = actionIndex ?? index;
  const action = feed.actions[activeActionIndex];
  const metadata = action.metadata;
  const user = feed.owner;
  const isOwner = isSameAddress(user, identity.identity);

  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">
              {isOwner
                ? identity.displayName || formatText(identity.identity)
                : formatText(user ?? "")}
            </div>
            donated
            <div className="strong">
              {formatValue(metadata?.token)} {metadata?.token?.symbol ?? ""}
            </div>
          </div>
        </div>

        {metadata && (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              className="feed-nft-img"
              style={{ width: 64, height: 64 }}
              src={metadata.logo}
            />
            <picture></picture>
            <div className="feed-nft-info">
              <div className="nft-title">{metadata?.title}</div>
              <div className="nft-subtitle">{metadata?.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DonationCard = memo(RenderDonationCard);
