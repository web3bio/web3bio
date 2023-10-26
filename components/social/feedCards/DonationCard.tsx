import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../../utils/ipfs";
import { formatValue } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

export function isDonationFeed(feed) {
  return feed.tag === Tag.Donation && feed.type === Type.Donate;
}

const RenderDonationCard = (props) => {
  const { feed } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;

  return (
    <Link
      href={resolveIPFS_URL(action?.related_urls?.[0]) || ""}
      target="_blank"
      className="feed-item-body"
    >
      <div className="feed-content">
        <div className="feed-content-header">
          Donated
          <strong>
            {formatValue(metadata?.token)} {metadata?.token?.symbol ?? ""}{" "}
          </strong>{" "}
          <NFTAssetPlayer
            width={"100%"}
            height={"100%"}
            className="feed-content-token-img"
            src={metadata?.token?.image}
          />{" "}
          on <strong>{feed.platform}</strong>
        </div>

        <div className={"feed-content-target"}>
          <div className="feed-target-name">
            <strong>{metadata.title}</strong>
          </div>
          <div className="feed-target-content">{metadata.description}</div>
        </div>
      </div>
    </Link>
  );
};

export const DonationCard = memo(RenderDonationCard);
