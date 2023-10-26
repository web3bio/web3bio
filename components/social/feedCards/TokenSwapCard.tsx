import Link from "next/link";
import { memo } from "react";
import { formatText, formatValue, isSameAddress } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
export function isTokenSwapFeed(feed) {
  return feed.tag === Tag.Exchange && feed.type === Type.Swap;
}

const RenderTokenSwapCard = (props) => {
  const { feed } = props;
  const action = feed.actions?.find((x) => x.type === Type.Swap);
  const metadata = action.metadata;

  return (
    <div className="feed-item-body">
      <div className="feed-content">
        <div className="feed-content-header">
          <div>
            Swaped {feed.platform && "on"}
            <strong>{feed.platform}</strong>
          </div>
        </div>

        {metadata ? (
          <div className={"feed-content flex"}>
            <div className="flex">
              <NFTAssetPlayer
                className="feed-content-token-img"
                src={metadata?.from?.image}
                alt={metadata?.from?.symbol || "ft1"}
              />
              <NFTAssetPlayer
                className="feed-content-token-img"
                src={metadata?.to?.image}
                alt={metadata?.to?.symbol || "ft2"}
              />
            </div>

            <div className="feed-content">
              <strong>
                {formatText(formatValue(metadata.from))} {metadata.from?.symbol}
              </strong>{" "}
              for{" "}
              <strong>
                {formatText(formatValue(metadata.to))} {metadata.to?.symbol}
              </strong>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const TokenSwapCard = memo(RenderTokenSwapCard);
