import Link from "next/link";
import { memo } from "react";
import {
  formatText,
  formatValue,
  isSameAddress,
} from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";
import SVG from "react-inlinesvg";

export function isDonationFeed(feed) {
  return feed.tag === Tag.Donation && feed.type === Type.Donate;
}

const RenderDonationCard = (props) => {
  const { feed } = props;
  const action = getLastAction(feed);
  const metadata = action.metadata;

  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">💌</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            donated
            <strong>
              {formatValue(metadata?.token)} {metadata?.token?.symbol ?? ""} on{" "}
              {feed.platform}
            </strong>
          </div>
          <Link
            href={action?.related_urls?.[0] || ""}
            target="_blank"
            className="action-icon"
          >
            <SVG src="../icons/icon-open.svg" width={20} height={20} />
          </Link>
        </div>

        {metadata && (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              width={"100%"}
              height={"100%"}
              className="feed-nft-img"
              src={metadata?.token?.image}
            />
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
