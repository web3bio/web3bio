import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../../utils/ipfs";
import { formatText, isSameAddress } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import { SocialPlatformMapping } from "../../../utils/platform";
import SVG from "react-inlinesvg";

export function isPostCard(feed) {
  return feed.tag === Tag.Social && [Type.Post].includes(feed.type);
}

const RenderPostCard = (props) => {
  const { feed, name, identity } = props;
  const action = feed.actions[0];
  const owner = identity.address;
  const metadata = action.metadata;
  const isOwner = isSameAddress(feed.owner, owner);
  return (
    <>
      <div className="feed-item-icon">
        <div className="feed-icon-emoji">
          📄
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
                    src={x.address}
                    type={x.mime_type}
                    alt={metadata.handle}
                    key={x.address}
                  />
                )
              )}
            </div>
          )}
        </Link>
      </div>
    </>
  );
};

export const PostCard = memo(RenderPostCard);
