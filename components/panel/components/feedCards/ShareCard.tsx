import Link from "next/link";
import { memo } from "react";
import {
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";
import SVG from "react-inlinesvg";

export function isShareCard(feed) {
  return feed.tag === Tag.Social && [Type.Share].includes(feed.type);
}

const RenderShareCard = (props) => {
  const { feed, name, identity } = props;
  const action = feed.actions[0];
  const owner = identity.address;
  const metadata = action.metadata;
  const target = metadata.target;
  const isOwner = isSameAddress(feed.owner, owner);
  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">😃</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">{target.handle}</div>
            mirrored{" "}
            <div className="strong">
              {isOwner
                ? name || formatText(owner)
                : formatText(feed.from ?? "")}
            </div>
            on
            <div className="strong">{action.platform || "unknown"}</div>
          </div>
          <Link
            href={resolveMediaURL(metadata.target_url) || ""}
            target="_blank"
            className="action-icon"
          >
            <SVG src="../icons/icon-open.svg" width={20} height={20} />
          </Link>
        </div>
        <div className="feed-item-main">
          <div className="feed-nft-info">
            {target?.body && <div className="nft-subtitle">{target.body}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShareCard = memo(RenderShareCard);
