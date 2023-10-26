import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../../utils/ipfs";
import { Tag, Type } from "../../apis/rss3/types";
import { formatText, resolveMediaURL } from "../../../utils/utils";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

export function isPostCard(feed) {
  return feed.tag === Tag.Social && [Type.Post].includes(feed.type);
}

const RenderPostCard = (props) => {
  const { feed } = props;

  const action = getLastAction(feed)
  const metadata = action.metadata;
  const commentTarget = metadata?.target;

  return (
    <Link
      className="feed-item-body"
      href={resolveIPFS_URL(action?.related_urls?.[0]) || ""}
      target="_blank"
    >
      <div className="feed-content text-assistive">
        published a post on <strong>{feed.platform}</strong>
      </div>
      <div className="feed-content">
        {metadata.body}
      </div>
      {metadata.media?.length > 0 && (
        <div className={`feed-content${metadata.media.length > 1 ? " media-gallery" : ""}`}>
          {metadata.media.map((x) => (
              <NFTAssetPlayer
                className="feed-content-img"
                src={resolveMediaURL(x.address)}
                type={x.mime_type}
                alt={metadata.handle}
                key={x.address}
              />
            )
          )}
        </div>
      )}
      {commentTarget && (
        <div className="feed-content">
          <div className="feed-content-target">
            <div className="feed-target-name">
              <strong>
                {formatText(commentTarget?.handle)}
              </strong>
            </div>
            <div className="feed-target-content">
              {commentTarget?.body}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export const PostCard = memo(RenderPostCard);
