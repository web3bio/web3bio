import Link from "next/link";
import { memo } from "react";
import {
  formatText,
  formatValue,
  isSameAddress,
} from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import SVG from "react-inlinesvg";
export function isTokenSwapFeed(feed) {
  return feed.tag === Tag.Exchange && feed.type === Type.Swap;
}

const RenderTokenSwapCard = (props) => {
  const { feed } = props;
  const action = feed.actions?.find((x) => x.type === Type.Swap);
  const metadata = action.metadata;

  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">💵</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            swaped {feed.platform && "on"}
            <strong>{feed.platform}</strong>
          </div>
          <Link
            href={action?.related_urls?.[0] || ""}
            target="_blank"
            className="action-icon"
          >
            <SVG src="../icons/icon-open.svg" width={20} height={20} />
          </Link>
        </div>

        {metadata ? (
          <div className={"feed-item-main"}>
            <div style={{ display: "flex" }}>
              <NFTAssetPlayer
                className="feed-swap-img"
                src={metadata?.from?.image}
                alt={metadata?.from?.symbol || "ft1"}
              />
              <NFTAssetPlayer
                className="feed-swap-img"
                src={metadata?.to?.image}
                alt={metadata?.to?.symbol || "ft2"}
              />
            </div>

            <div className="feed-nft-info">
              <div className="nft-title">
                {formatValue(metadata.from)} {metadata.from?.symbol} for{" "}
                {formatValue(metadata.to)} {metadata.to?.symbol}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const TokenSwapCard = memo(RenderTokenSwapCard);
