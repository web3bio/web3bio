import { memo } from "react";
import { formatTimestamp } from "../../../utils/date";
import { formatText, formatValue, isSameAddress } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === Tag.Transaction &&
    [Type.Transfer, Type.Burn].includes(feed.type)
  );
};

const RenderTokenOperationCard = (props) => {
  const { feed, identity } = props;
  const action = feed.actions[0];
  const metadata = action.metadata;
  const isFromOwner = isSameAddress(identity.identity, action.address_from);
  const _to = isSameAddress(identity.identity, action.address_to)
    ? identity.displayName
    : formatText(feed.address_to ?? "");
  const context =
    feed.type === Type.Burn ? "burn" : isFromOwner ? "send to" : "claim from";
  console.log(feed)
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">
              {isFromOwner
                ? identity.displayName || formatText(identity.identity)
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
