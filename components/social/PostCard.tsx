import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { ActivityTag, ActivityType } from "../apis/rss3/types";
import { formatText, resolveMediaURL } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

export function isPostCard(feed) {
  return feed.tag === ActivityTag.Social && [ActivityType.Post].includes(feed.type);
}

export function isCommentFeed(feed) {
  return feed.tag === ActivityTag.Social && feed.type === ActivityType.Comment;
}

const RenderPostCard = (props) => {
  const { feed } = props;

  const action = getLastAction(feed)
  const metadata = action.metadata;
  const commentTarget = metadata?.target;

  return (
    <div className="feed-item-body">
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
          ))}
        </div>
      )}
      {commentTarget && (
        <Link
          className="feed-content"
          href={resolveIPFS_URL(metadata?.target_url) || ""}
          target="_blank"
        >
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
        </Link>
      )}
    </div>
  );
};

export const PostCard = memo(RenderPostCard);
