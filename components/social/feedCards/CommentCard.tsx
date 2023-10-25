import { memo } from "react";
import {
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import SVG from "react-inlinesvg";
import { SocialPlatformMapping } from "../../../utils/platform";
import Link from "next/link";

export function isCommentFeed(feed) {
  return feed.tag === Tag.Social && feed.type === Type.Comment;
}

const RenderCommentFeed = (props) => {
  const { feed, identity, name } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;
  const owner = identity.address;
  const commentTarget = metadata?.target;

  const isOwner = isSameAddress(owner, feed.owner);

  return (
    <>
      <div className="feed-item-icon">
        <div className="feed-icon-emoji">
          💬
          <div className={`feed-icon-platform ${feed?.platform.toLowerCase()}`}>
            <SVG
              width={"100%"}
              height={"100%"}
              style={{
                borderRadius:'.6rem'
              }}
              fill={
                SocialPlatformMapping(feed?.platform.toLowerCase()).color
              }
              src={
                SocialPlatformMapping(feed?.platform.toLowerCase()).icon ||
                ""
              }
            />
          </div>
        </div>
      </div>
      <div className="feed-item-content">
        <div className="feed-item-header">
          <div className="feed-item-name">
            <strong>
              {isOwner
                ? name || formatText(owner)
                : formatText(feed.from ?? "")}
            </strong>
          </div>
          <div className="feed-item-action">
            <div className="feed-timestamp">
              {new Date(feed.timestamp).toDateString()}
            </div>
          </div>
        </div>
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
          {commentTarget && (
            <div className="feed-content">
              <div className="feed-content-target">
                <div className="feed-target-name">
                  <strong>
                    {formatText(commentTarget?.author[0])}
                  </strong>
                </div>
                <div className="feed-target-content">
                  {commentTarget?.body}
                </div>
              </div>
            </div>
          )}
        </Link>
      </div>
    </>
  );
};

export const CommentCard = memo(RenderCommentFeed);
