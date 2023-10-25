import Link from "next/link";
import { memo, useMemo } from "react";
import {
  formatText,
  formatValue,
  isSameAddress,
} from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";
import { NFTAssetPlayer } from "../../../shared/NFTAssetPlayer";
import SVG from "react-inlinesvg";
import { getLastAction } from "./CollectibleCard";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === Tag.Transaction &&
    [Type.Transfer, Type.Burn, Type.Approval].includes(feed.type)
  );
};

const RenderTokenOperationCard = (props) => {
  const { feed, identity, name } = props;
  const owner = identity.address;

  const { metadata, summary, action } = useMemo(() => {
    let action;
    let metadata;
    action = getLastAction(feed);
    metadata = action.metadata;
    const isFromOwner = isSameAddress(owner, action.address_from);

    const _from = isFromOwner ? name : formatText(owner ?? "");
    const _to = isSameAddress(owner, action.address_to)
      ? name || formatText(owner)
      : formatText(action.address_to ?? "");
    switch (feed.type) {
      case Type.Transfer:
        return {
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              sent to
              <strong>{_to}</strong>
            </div>
          ),
        };
      case Type.Approval:
        return {
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              approved to
              <strong>{_to}</strong>
            </div>
          ),
        };
      case Type.Burn:
        return {
          metadata,
          action,
          summary: (
            <div className="feed-type-intro">
              <strong>{_from}</strong>
              burned
            </div>
          ),
        };
    }

    return { summary: "", metadata };
  }, [feed, owner, name]);
  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">💰</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">{summary}</div>

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
              width={"100%"}
              height={"100%"}
              className="feed-nft-img"
              src={metadata.image}
              alt={metadata.symbol}
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
