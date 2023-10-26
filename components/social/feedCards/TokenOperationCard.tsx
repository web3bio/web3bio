import { memo, useMemo } from "react";
import { formatText, formatValue, isSameAddress } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === Tag.Transaction &&
    [Type.Transfer, Type.Burn, Type.Approval].includes(feed.type)
  );
};

const RenderTokenOperationCard = (props) => {
  const { feed, identity } = props;

  const RenderToken = (metadata) => {
    return (
      <>
        <strong>
          {formatText(formatValue(metadata))} {metadata.symbol}
        </strong>{" "}
        {metadata?.image && (
          <NFTAssetPlayer
            width={"100%"}
            height={"100%"}
            className="feed-content-token-img"
            src={metadata.image}
            alt={metadata.symbol}
            type="image/png"
          />
        )}
      </>
    );
  };
  const { summary } = useMemo(() => {
    let action;
    let metadata;
    action = getLastAction(feed);
    metadata = action.metadata;
    const _to = isSameAddress(identity.address, action.to)
      ? identity.displayName || formatText(identity.address)
      : formatText(action.to ?? "");
    switch (feed.type) {
      case Type.Transfer:
        return {
          metadata,
          action,
          summary: (
            <>
              Sent {RenderToken(metadata)}
              to
              <strong>{_to}</strong>
            </>
          ),
        };
      case Type.Approval:
        return {
          metadata,
          action,
          summary: (
            <>
              Approved {RenderToken(metadata)}
              to
              <strong>{_to}</strong>
            </>
          ),
        };
      case Type.Burn:
        return {
          metadata,
          action,
          summary: <>Burned {RenderToken(metadata)}</>,
        };
    }

    return { summary: "" };
  }, [feed, identity]);
  return (
    <div className="feed-item-body">
      <div className="feed-content flex">{summary}</div>
    </div>
  );
};

export const TokenOperationCard = memo(RenderTokenOperationCard);
