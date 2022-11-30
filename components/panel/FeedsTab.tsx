import { memo, useEffect, useRef, useState } from "react";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
import { FeedItem, isSupportedFeed } from "./FeedItem";
import { formatTimestamp } from "../../utils/date";
import useSWRInfinite from "swr/infinite";
import { throttle } from "../../utils/utils";

const PAGE_SIZE = 30;
const getFeedsURL = (
  address: string,
  startHash?: string,
  previousPageData?
) => {
  if (previousPageData && !previousPageData.length) return null;
  return (
    RSS3_END_POINT +
    `notes/${address}?limit=${PAGE_SIZE}${
      startHash ? `&cursor=${startHash}` : ""
    }&&include_poap=false&count_only=false&query_status=false`
  );
};

function useFeeds(address: string, startHash?: string) {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    () => getFeedsURL(address, startHash),
    RSS3Fetcher
  );
  return {
    data: (data && data[0].result) || [],
    isLoading: !error && !data,
    error,
    size,
    setSize,
    isValidating,
  };
}

const RenderFeedsTab = (props) => {
  const { identity } = props;
  const [startHash, setStartHash] = useState("");
  const { data, error, size, setSize, isValidating } = useFeeds(
    identity.identity,
    startHash
  );
  const issues = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    const scrollLoad = (e) => {
      const scrollHeight = e.target.scrollHeight;
      const scrollTop = e.target.scrollTop;
      const offsetHeight = e.target.offsetHeight;
      if (offsetHeight + scrollTop >= scrollHeight) {
        if (issues.length > 0 && !isValidating) {
          if (isReachingEnd) return;
          const len = issues.length;
          console.log(issues, "issues");
          setStartHash(issues[len - 1].hash);
          setSize(size + 1);
        }
      }
    };
    if (container) {
      container.addEventListener("scroll", throttle(scrollLoad, 100));
    }
    return () =>
      container.removeEventListener("scroll", throttle(scrollLoad, 100));
  }, [data, isReachingEnd, issues, size, setSize, startHash, isValidating]);

  console.log("feeds data");
  return (
    <div className="feeds-container-box">
      <div className="feeds-title">Social Feeds</div>

      <div ref={ref} className="feeds-container">
        {isEmpty ? <p>Yay, no issues found.</p> : null}
        {issues.map(
          (x, idx) =>
            (isSupportedFeed(x) && (
              <div key={idx}>
                <FeedItem identity={identity} feed={x} />
                <div className="feed-timestamp">
                  {formatTimestamp(x.timestamp)}
                </div>
              </div>
            )) ||
            null
        )}
        {isLoadingMore
          ? "loading..."
          : isReachingEnd
          ? "no more issues"
          : "scroll to load"}
      </div>
    </div>
  );
};

export const FeedsTab = memo(RenderFeedsTab);
