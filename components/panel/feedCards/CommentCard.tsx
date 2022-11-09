import { memo } from "react";
import { formatText } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";

export function isCommentFeed(feed) {
  return feed.tag === Tag.Social && feed.type === Type.Comment;
}

const RenderCommentFeed = (props) => {
  const { feed, identity } = props;

  const action = feed.actions[0];
  const metadata = action.metadata;

  const user = identity.identity;
  const commentTarget = metadata?.targetuseAddressLabel;
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">{formatText(user ?? "")}</div>
            made a comment on
            <div className="strong">{action.platform || "unknown"}</div>
          </div>
        </div>
        <div>{metadata?.body}</div>

        {commentTarget && (
          <div className={"feed-item-main"}>
            <picture>
              <img
                className="feed-nft-img"
                style={{ width: 64, height: 64 }}
                src={commentTarget.media[0].address}
                alt="comment"
              />
            </picture>
            <div className="feed-nft-info">{commentTarget?.body}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentCard = memo(RenderCommentFeed);
