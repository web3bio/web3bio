import { memo, useMemo } from "react";
import { formatText, formatValue, isSameAddress } from "../../utils/utils";
import { ActivityTag, ActivityType } from "../apis/rss3/types";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === ActivityTag.Transaction &&
    [ActivityType.Transfer, ActivityType.Burn, ActivityType.Approval].includes(feed.type)
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
      case ActivityType.Transfer:
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
      case ActivityType.Approval:
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
      case ActivityType.Burn:
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
