import { memo } from "react";
import { formatText } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import Link from "next/link";

export function isCommentFeed(feed) {
  return feed.tag === Tag.Social && feed.type === Type.Comment;
}

const RenderCommentFeed = (props) => {
  const { feed } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;
  const commentTarget = metadata?.target;

  return (
    <Link
      className="feed-item-body"
      href={action?.related_urls?.[0] || ""}
      target="_blank"
    >
      <div className="feed-content text-assistive">
        made a comment on <strong>{feed.platform}</strong>
      </div>
      <div className="feed-content">
        {metadata.body}
      </div>
      {metadata.media?.length > 0 && (
        <div className={`feed-content${metadata.media.length > 1 ? " media-gallery" : ""}`}>
          {metadata.media.map((x) => {
            return (
              <NFTAssetPlayer
                className="feed-content-img"
                src={x.address}
                type={x.mime_type}
                alt={metadata.handle}
                key={x.address}
              />
            )
          })}
        </div>
      )}
      
    </Link>
  );
};

export const CommentCard = memo(RenderCommentFeed);
