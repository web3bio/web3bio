import { memo } from "react";
import {
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";
import SVG from "react-inlinesvg";
import { SocialPlatformMapping } from "../../../../utils/platform";
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
    <div className="feed-item-box">
      <div className="feed-badge-emoji">💡</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <strong>
              {isOwner ? name || formatText(owner) : formatText(owner ?? "")}
            </strong>
            made a comment on
            <strong>{action.platform || "unknown"}</strong>
          </div>
          <Link
            href={action?.related_urls?.[0] || ""}
            target="_blank"
            className="action-icon"
          >
            <SVG src="../icons/icon-open.svg" width={20} height={20} />
          </Link>
        </div>

        <div className={"feed-item-main"}>
          {metadata.media ? (
            <NFTAssetPlayer
              className="feed-nft-img"
              src={resolveMediaURL(metadata.media?.[0]?.address)}
              alt={metadata.body}
            />
          ) : (
            <div className="feed-nft-img">
              <SVG
                width={"100%"}
                height={"100%"}
                style={{
                  borderRadius:'.6rem'
                }}
                fill={
                  SocialPlatformMapping(action?.platform.toLowerCase()).color
                }
                src={
                  SocialPlatformMapping(action?.platform.toLowerCase()).icon ||
                  ""
                }
              />
            </div>
          )}
          <div className="feed-nft-info">
            <div className="nft-title">{metadata.body}</div>
          </div>
        </div>
        {commentTarget && (
          <div className="feed-item-main">
            <div className="feed-nft-info">
              <div className="nft-subtitle">{commentTarget?.body}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentCard = memo(RenderCommentFeed);
