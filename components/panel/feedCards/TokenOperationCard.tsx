import { memo } from "react";
import { formatText, formatValue, isSameAddress } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === Tag.Transaction &&
    [Type.Transfer, Type.Burn].includes(feed.type)
  );
};

const RenderTokenOperationCard = (props) => {
  const { feed, identity } = props;
  console.log(identity,'gg')
  const action = feed.actions[0];
  const metadata = action.metadata;
  const isFromOwner = isSameAddress(identity, action.address_from);
  const context =
    feed.type === Type.Burn ? "burn" : isFromOwner ? "send" : "claim";
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">{formatText(feed.address_from ?? "")}</div>
            {context}
            <div className="strong">{formatText(feed.address_to ?? "")}</div>
          </div>
        </div>

        {metadata ? (
          <div className={"feed-item-main"}>
            <picture>
              <img className="feed-nft-img" src={metadata.image} alt="ft" />
            </picture>
            <div className="feed-nft-info">
              <div className="nft-title">
                {formatValue(metadata)} {metadata.symbol}
              </div>
            </div>
          </div>
        ) : null}
        <div>7hrs</div>
      </div>
    </div>
  );
};

export const TokenOperationCard = memo(RenderTokenOperationCard);
