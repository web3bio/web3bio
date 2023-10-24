import { memo, useState } from "react";
import { formatTimestamp } from "../../utils/date";

import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { FeedItem, isSupportedFeed } from "./components/FeedItem";

const RenderFeedsTab = (props) => {
  const { identity, data, network } = props;

  if (!data) return <Empty text="No Feeds" />;
  return (
    <div className="feeds-container">
      <div className="social-feeds-list">
        {data.map(
          (x, idx) =>
            (isSupportedFeed(x) && (
              <div key={idx}>
                <FeedItem network={network} identity={identity} feed={x} />
                <div className="feed-timestamp">
                  {formatTimestamp(x.timestamp)}
                </div>
              </div>
            )) ||
            null
        )}
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            margin: "1.5rem 0",
            justifyContent: "center",
          }}
        >
          {/* {isLoadingMore ? (
            <Loading />
          ) : isReachingEnd ? (
            "No More Feeds"
          ) : (
            <Loading />
          )} */}
        </div>
      </div>
    </div>
  );
};

export const FeedsTab = memo(RenderFeedsTab);
