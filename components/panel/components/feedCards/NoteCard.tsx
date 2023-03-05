import { memo } from "react";
import { formatText, isSameAddress } from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";

export function isNoteFeed(feed) {
  return (
    feed.tag === Tag.Social && [Type.Post, Type.Revise].includes(feed.type)
  );
}

const RenderNoteCard = (props) => {
  const { feed,name,owner } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;
  const isOwner = isSameAddress(feed.address_from, owner);

  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">
              {isOwner
                ? name || formatText(owner)
                : formatText(feed.address_from ?? "")}
            </div>
            posted a note on
            <div className="strong">{action.platform || "unknown"}</div>
          </div>
        </div>
        <div className="feed-item-main">
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

export const NoteCard = memo(RenderNoteCard);
