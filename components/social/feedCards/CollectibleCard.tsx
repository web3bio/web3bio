import Link from "next/link";
import { memo, useMemo } from "react";
import {
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import SVG from "react-inlinesvg";
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
  const { feed, name, identity } = props;
  const user = identity.address;
  const isOwner = isSameAddress(user, feed.owner);

  const { metadata, summary, action, image_url } = useMemo(() => {
    let action;
    let metadata;
    let image_url;
    const _from = isOwner ? name : formatText(user ?? "");
    const _to = isSameAddress(user, feed.address_to)
      ? name || formatText(user)
      : formatText(feed.address_to ?? "");

    switch (feed.type) {
      case Type.Mint:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.image;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              minted
              <strong>{metadata.name}</strong>
            </div>
          ),
        };
      case Type.Trade:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.image;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              sold an NFT to
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
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              {metadata.action == "text"
                ? "updated a text record on"
                : "renewed"}
              <strong>{action.platform}</strong>
            </div>
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
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              approved
              <strong>{metadata.name}</strong> to
              <strong>{_to}</strong>
            </div>
          ),
        };
      case Type.Transfer:
        action = getLastAction(feed);
        metadata = action.metadata;

        return {
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              sent an NFT to
              <strong>{_to}</strong>
            </div>
          ),
        };
      case Type.Burn:
        action = getLastAction(feed);
        metadata = action.metadata;
        image_url = metadata.image;
        return {
          metadata,
          action,
          image_url,
          summary: (
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              burned an NFT
            </div>
          ),
        };
    }

    return { summary: "", image_url };
  }, [feed, user, isOwner, name]);

  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">🍞</div>
      <div className="feed-item">
        <div className="feed-item-header">
          {summary}
          <Link
            href={action?.related_urls?.[0] || ""}
            target="_blank"
            className="action-icon"
          >
            <SVG src="../icons/icon-open.svg" width={20} height={20} />
          </Link>
        </div>

        {metadata ? (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              height={"100%"}
              className="feed-nft-img"
              src={resolveMediaURL(image_url) || ""}
              type="image/png"
              alt={metadata.name}
            />

            {feed.type === Type.Edit ? (
              <div className="feed-nft-info">
                <div className="nft-title">{metadata.name}</div>
                <div className="nft-subtitle">
                  <strong>{metadata.key}</strong> {metadata.value}
                </div>
              </div>
            ) : (
              <div className="feed-nft-info">
                <div className="nft-title">
                  {metadata.name || metadata.body}
                </div>
                <div className="nft-subtitle">{metadata.description}</div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const CollectibleCard = memo(RenderCollectibleCard);