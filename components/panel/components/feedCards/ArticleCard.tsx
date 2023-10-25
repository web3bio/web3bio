import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../../../utils/ipfs";
import { formatText, isSameAddress } from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";
import SVG from "react-inlinesvg";

export function isArticleCard(feed) {
  return feed.tag === Tag.Social && [Type.Post].includes(feed.type);
}

const RenderArticleCard = (props) => {
  const { feed, name, identity } = props;
  const action = feed.actions[0];
  const owner = identity.address;
  const metadata = action.metadata;
  const isOwner = isSameAddress(feed.owner, owner);
  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">🗒️</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <strong>
              {isOwner
                ? name || formatText(owner)
                : formatText(feed.from ?? "")}
            </strong>
            posted an article on
            <strong>{action.platform || "unknown"}</strong>
          </div>
          <Link
            href={resolveIPFS_URL(action?.related_urls?.[0]) || ""}
            target="_blank"
            className="action-icon"
          >
            <SVG src="../icons/icon-open.svg" width={20} height={20} />
          </Link>
        </div>
        <div className="feed-item-main">
          {metadata?.media?.length && (
            <NFTAssetPlayer
              className="feed-nft-img"
              src={resolveIPFS_URL(metadata.media?.[0].address) || ""}
              type="image/png"
              alt={metadata.handle}
            />
          )}
          <div className="feed-nft-info">
            {metadata?.title && (
              <div className="nft-title">{metadata.title}</div>
            )}
            {metadata?.body && (
              <div className="nft-subtitle">{metadata.body}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArticleCard = memo(RenderArticleCard);
