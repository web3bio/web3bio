import { memo } from "react";
import useSWR from "swr";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { FeedItem, isSupportedFeed } from "./FeedItem";
import { formatTimestamp } from "../../utils/date";

function useFeeds(address: string, page) {
  const { data, error } = useSWR<any>(
    RSS3_END_POINT +
      `notes/${address}?limit=50&cursor=${page}&include_poap=false&count_only=false&query_status=false`,
    RSS3Fetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
const RenderFeedsTab = (props) => {
  const { identity } = props;
  const { data, isLoading, isError } = useFeeds(identity.identity, 1);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.result) return <Empty />;
  console.log(data,'feeds data')
  return (
    <div className="feeds-container-box">
      <div className="feeds-title">Social Feeds</div>
      <div className="feeds-container">
        {data.result.map((x, idx) => {
          return (
            isSupportedFeed(x) && (
              <div key={idx}>
                <FeedItem identity={identity} feed={x} />
                <div className="feed-timestamp">
                  {formatTimestamp(x.timestamp)}
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export const FeedsTab = memo(RenderFeedsTab);
