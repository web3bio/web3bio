import { memo, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { FeedItem, isSupportedFeed } from "./FeedItem";
import { formatTimestamp } from "../../utils/date";

function useFeeds(address: string, startHash?: string) {
  const { data, error } = useSWR<any>(
    RSS3_END_POINT +
      `notes/${address}?limit=30${
        startHash ? `&cursor=${startHash}` : ""
      }&&include_poap=false&count_only=false&query_status=false`,
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
  const [startHash, setStartHash] = useState("");
  const [showData, setShowData] = useState([]);
  const { data, isLoading, isError } = useFeeds(identity.identity, startHash);
  const ref = useRef(null);
  useEffect(() => {
    if (data && data.result) {
      const arr = showData.concat(data.result);
      setShowData(Array.from(new Set(arr)));
    }
    const scrollLoad = (e) => {
      //可视区高度
      let scrollHeight = e.target.scrollHeight;
      //滚动高度
      let scrollTop = e.target.scrollTop;
      //列表内容实际高度
      let offsetHeight = e.target.offsetHeight;
      if (offsetHeight + scrollTop >= scrollHeight) {
        if (showData.length > 0) {
          const len = showData.length;
          setStartHash(showData[len - 1].hash);
        }
      }
    };
    if (ref.current) {
      ref.current.addEventListener("scroll", scrollLoad);
    }
  }, [showData]);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!showData.length) return <Empty />;
  console.log(data, "feeds data");
  return (
    <div className="feeds-container-box">
      <div className="feeds-title">Social Feeds</div>
      <div ref={ref} className="feeds-container">
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
