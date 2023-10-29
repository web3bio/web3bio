import Link from "next/link";
import { memo, useMemo } from "react";
import { resolveIPFS_URL } from "../../utils/ipfs";
import {
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../utils/utils";
import { ActivityTag, ActivityType } from "../../utils/activity";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

export function isCollectibleFeed(feed) {
  return (
    feed.tag === ActivityTag.collectible &&
    [
      ActivityType.mint,
      ActivityType.transfer,
      ActivityType.trade,
      ActivityType.burn,
      ActivityType.approval,
    ].includes(feed.type)
  );
}

export function getLastAction(feed) {
  return feed.actions[feed.actions.length - 1];
}

const RenderCollectibleCard = (props) => {
  const { feed, identity } = props;

  const { metadata, summary, image_url, action } = useMemo(() => {
    let action;
    let metadata;
    let image_url;

    const _to = isSameAddress(identity.address, feed.to)
      ? identity.displayName || formatText(identity.address)
      : formatText(feed.to ?? "");

    switch (feed.type) {
      case ActivityType.mint:
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
      case ActivityType.trade:
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
      case ActivityType.approval:
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
      case ActivityType.transfer:
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
      case ActivityType.burn:
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
        {summary}

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
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export const CollectibleCard = memo(RenderCollectibleCard);
