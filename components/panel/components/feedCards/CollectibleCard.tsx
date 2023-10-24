import Link from "next/link";
import { memo, useMemo } from "react";
import { resolveIPFS_URL } from "../../../../utils/ipfs";
import { formatText, isSameAddress } from "../../../../utils/utils";
import { CardType, Tag, Type } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";
import SVG from "react-inlinesvg";
export function isCollectibleFeed(feed) {
  return feed.tag === Tag.Collectible;
}

export function getLastAction(feed) {
  return feed.actions[feed.actions.length - 1];
}

const RenderCollectibleCard = (props) => {
  const { feed, name, identity } = props;
  const user = identity.address;
  const isOwner = isSameAddress(user, feed.owner);

  const { metadata, summary, action } = useMemo(() => {
    let action;
    let metadata;
    const _from = isOwner ? name : formatText(user ?? "");
    const _to = isSameAddress(user, feed.to)
      ? name || formatText(user)
      : formatText(feed.to ?? "");
    switch (feed.type) {
      case Type.Mint:
        action = getLastAction(feed)
        metadata = action.metadata;
        return {
          cardType: CardType.CollectibleMint,
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{_from}</div>
              minted
              <div className="strong">{metadata.name}</div>
            </div>
          ),
        };
      case Type.Trade:
        action = getLastAction(feed);
        metadata = action.metadata;
        return {
          cardType: CardType.CollectibleOut,
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{_from}</div>
              sold an NFT to
              <div className="strong">{_to}</div>
            </div>
          ),
        };
      case Type.Transfer:
        action = getLastAction(feed);
        metadata = action.metadata;
        const isSending = isSameAddress(feed.owner, action.from);
        return {
          cardType: isSending
            ? CardType.CollectibleOut
            : CardType.CollectibleIn,
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{_from}</div>
              sent an NFT to
              <div className="strong">{_to}</div>
            </div>
          ),
        };
      case Type.Burn:
        action = getLastAction(feed)
        metadata = action.metadata;
        return {
          cardType: CardType.CollectibleBurn,
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{_from}</div>
              burned an NFT
            </div>
          ),
        };
    }

    return { summary: "", cardType: CardType.CollectibleIn };
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
            {metadata.image_url && (
              <NFTAssetPlayer
                height={"100%"}
                className="feed-nft-img"
                src={resolveIPFS_URL(metadata.image_url) || ""}
                type="image/png"
                alt={metadata.name}
              />
            )}

            <div className="feed-nft-info">
              <div className="nft-title">{metadata.title}</div>
              {metadata.description ? (
                <div className="nft-subtitle">{metadata.description}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const CollectibleCard = memo(RenderCollectibleCard);
