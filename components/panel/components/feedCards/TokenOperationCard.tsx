import { memo } from "react";
import { formatText, formatValue, isSameAddress } from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === Tag.Transaction &&
    [Type.Transfer, Type.Burn].includes(feed.type)
  );
};

const RenderTokenOperationCard = (props) => {
  const { feed, owner, name } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;
  const isFromOwner = isSameAddress(owner, action.address_from);
  const _to = isSameAddress(owner, action.address_to)
    ? name
    : formatText(feed.address_to ?? "");
  const context =
    feed.type === Type.Burn ? "burn" : isFromOwner ? "send to" : "claim from";
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">
              {isFromOwner
                ? name || formatText(owner)
                : formatText(action.address_from ?? "")}
            </div>
            {context}
            <div className="strong">{_to}</div>
          </div>
        </div>

        {metadata ? (
          <div className={"feed-item-main"}>
            <NFTAssetPlayer
              className="feed-nft-img"
              src={metadata.image}
              type="image/png"
            />
            <div className="feed-nft-info">
              <div className="nft-title">
                {formatValue(metadata)} {metadata.symbol}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const TokenOperationCard = memo(RenderTokenOperationCard);
