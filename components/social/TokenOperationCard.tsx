import { memo, useMemo } from "react";
import { formatText, formatValue, isSameAddress } from "../../utils/utils";
import { ActivityTag, ActivityType } from "../apis/rss3/types";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === ActivityTag.transaction &&
    [ActivityType.transfer, ActivityType.burn, ActivityType.approval].includes(feed.type)
  );
};

const RenderTokenOperationCard = (props) => {
  const { feed, identity } = props;

  const RenderToken = (metadata) => {
    return (
      <>
        {metadata?.image && (
          <NFTAssetPlayer
            width={"100%"}
            height={"100%"}
            className="feed-content-token-icon"
            src={metadata.image}
            alt={metadata.symbol}
            type="image/png"
          />
        )}
        {" "}
        <strong>
          {formatText(formatValue(metadata))} {metadata.symbol}
        </strong>
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
      case ActivityType.transfer:
        return {
          metadata,
          action,
          summary: (
            <>
              Sent{" "}{RenderToken(metadata)}{" "}
              to{" "}
              <strong>{_to}</strong>
            </>
          ),
        };
      case ActivityType.approval:
        return {
          metadata,
          action,
          summary: (
            <>
              Approved{" "}{RenderToken(metadata)}{" "}to{" "}
              <strong>{_to}</strong>
            </>
          ),
        };
      case ActivityType.burn:
        return {
          metadata,
          action,
          summary: <>Burned{" "}{RenderToken(metadata)}</>,
        };
    }

    return { summary: "" };
  }, [feed, identity]);
  return (
    <div className="feed-item-body">
      <div className="feed-content">{summary}</div>
    </div>
  );
};

export const TokenOperationCard = memo(RenderTokenOperationCard);
