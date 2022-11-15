import { memo, useMemo } from "react";
import { formatText, formatValue, isSameAddress } from "../../../utils/utils";
import { CardType, Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
export function isCollectibleFeed(feed) {
  return feed.tag === Tag.Collectible;
}

export function getLastAction(feed) {
  return feed.actions[feed.actions.length - 1];
}

const RenderCollectibleCard = (props) => {
  const { feed, identity } = props;
  const user = identity.identity;
  const { metadata, cardType, summary } = useMemo(() => {
    let action;
    let metadata;
    switch (feed.type) {
      case Type.Mint:
        // If only one action, it should be free minting
        metadata = getLastAction(feed).metadata;
        return {
          cardType: CardType.CollectibleMint,
          metadata,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{formatText(user ?? "")}</div>
              minted an NFT
              <div className="strong">
                {metadata.cost &&
                  `for ${formatValue(metadata?.cost)} ${metadata.cost.symbol}`}
              </div>
            </div>
          ),
        };
      case Type.Trade:
        action = getLastAction(feed);
        metadata = action.metadata;
        return {
          cardType: CardType.CollectibleOut,
          metadata,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{formatText(user ?? "")}</div>
              sold an NFT to
              <div className="strong">
                {formatText(action.address_to ?? "")}
              </div>
            </div>
          ),
        };
      case Type.Transfer:
        action = getLastAction(feed);
        metadata = action.metadata;
        const standard = feed.actions[0].metadata?.standard;
        const costMetadata =
          standard && ["Native", "ERC-20"].includes(standard)
            ? feed.actions[0].metadata
            : undefined;
        const isSending = isSameAddress(feed.owner, action.address_from);
        return {
          cardType: isSending
            ? CardType.CollectibleOut
            : CardType.CollectibleIn,
          metadata,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">
                {formatText(action.address_from ?? "")}
              </div>
              sent an NFT to
              <div className="strong">
                {formatText(action.address_to ?? "")}
              </div>
            </div>
          ),
        };
      case Type.Burn:
        metadata = getLastAction(feed).metadata;
        return {
          cardType: CardType.CollectibleBurn,
          metadata,
          summary: (
            <div className="feed-type-intro">
              <div className="strong">{formatText(user ?? "")}</div>
              burned an NFT
            </div>
          ),
        };
    }

    return { summary: "", cardType: CardType.CollectibleIn };
  }, [feed, user]);

  const imageSize = 64;
  const attributes =
    metadata && "attributes" in metadata
      ? metadata.attributes?.filter((x) => x.trait_type)
      : [];
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">{summary}</div>

        {metadata ? (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              className="feed-nft-img"
              src={metadata.image}
              type='image/png'
            />

            <div className="feed-nft-info">
              <div className="nft-title">
                {formatValue(metadata)} {metadata.symbol}
              </div>
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
