import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { ActivityTypeMapping, formatText, formatValue } from "../../utils/utils";

const RenderToken = (metadata) => {
  return (
    <div className="feed-token">
      {metadata?.image && (
        <Image
          className="feed-token-icon"
          src={metadata.image}
          alt={metadata.name}
          height={20}
          width={20}
        />
      )}
      <span className="feed-token-value text-bold">
        {formatText(formatValue(metadata))} 
      </span>
      <span className="feed-token-symbol">{metadata.symbol}</span>
    </div>
  );
};

const RenderTransactionCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;

  return (
    <>
      <div className="feed-content">
        {ActivityTypeMapping(action.type).action}
        {RenderToken(metadata)}
        {ActivityTypeMapping(action.type).prep==="to" && ` to ${formatText(action.to)}`}
      </div>
    </>
  );
};

export const TransactionCard = memo(RenderTransactionCard);