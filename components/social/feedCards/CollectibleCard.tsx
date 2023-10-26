import Link from "next/link";
import { memo, useMemo } from "react";
import { resolveIPFS_URL } from "../../../utils/ipfs";
import {
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

export function isCollectibleFeed(feed) {
  return (
    feed.tag === Tag.Collectible &&
    [
      Type.Mint,
      Type.Transfer,
      Type.Trade,
      Type.Burn,
      Type.Approval,
      Type.Edit,
    ].includes(feed.type)
  );
}

export function getLastAction(feed) {
  return feed.actions[feed.actions.length - 1];
}

const RenderCollectibleCard = (props) => {
  const { feed, identity } = props;
  const isOwner = isSameAddress(identity.address, feed.owner);

  const { metadata, summary, image_url, action } = useMemo(() => {
    let action;
    let metadata;
    let image_url;

    const _to = isSameAddress(identity.address, feed.to)
      ? identity.displayName || formatText(identity.address)
      : formatText(feed.to ?? "");

    switch (feed.type) {
      case Type.Mint:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.image_url;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <>
              minted
              <strong>{metadata.name}</strong>
            </>
          ),
        };
      case Type.Trade:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.image_url;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <div className="feed-type-intro">
              Sold an NFT to
              <strong>{_to}</strong>
            </div>
          ),
        };
      case Type.Edit:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.detail.image;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <>
              {metadata.action == "text"
                ? "Updated a text record on"
                : "Renewed"}
              <strong>{action.platform}</strong>
            </>
          ),
        };
      case Type.Approval:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.image;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <>
              Approved
              <strong>{metadata.name}</strong> to
              <strong>{_to}</strong>
            </>
          ),
        };
      case Type.Transfer:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = resolveIPFS_URL(metadata.image_url);
        return {
          metadata,
          action,
          summary: (
            <>
              Sent <strong>{metadata.name}</strong> to
              <strong>{_to}</strong>
            </>
          ),
        };
      case Type.Burn:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.image_url;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <>
              Burned <strong>{metadata.name}</strong>
            </>
          ),
        };
    }

    return { summary: "", image_url };
  }, [feed, identity]);

  return (
    <Link
      href={resolveIPFS_URL(action?.related_urls?.[0]) || ""}
      target="_blank"
      className="feed-item-body"
    >
      <div className="feed-content">
        <div className="feed-content-header">{summary}</div>

        {metadata ? (
          <div className={"feed-content"}>
            {image_url && (
              <NFTAssetPlayer
                className="feed-content-img"
                src={resolveMediaURL(image_url) || ""}
                type="image/png"
                alt={metadata.name}
              />
            )}

            {feed.type === Type.Edit ? (
              <div className="feed-content-target">
                <div className="feed-target-name">{metadata.name}</div>
                <div className="feed-target-content">
                  <strong>{metadata.key}</strong> {metadata.value}
                </div>
              </div>
            ) : (
              <div className="feed-content-target">
                <div className="feed-target-name">
                  <strong>{metadata.title || metadata.name}</strong>
                </div>
                <div className="feed-target-content">
                  {metadata.description}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export const CollectibleCard = memo(RenderCollectibleCard);
