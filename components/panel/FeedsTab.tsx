import { memo, useEffect, useRef, useState } from "react";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
import { FeedItem, isSupportedFeed } from "./FeedItem";
import { formatTimestamp } from "../../utils/date";
import useSWRInfinite from "swr/infinite";
import { Loading } from "../shared/Loading";

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
  const [issues, setIssues] = useState([]);
  const { data, error, size, setSize, isValidating, isLoading } = useFeeds(
    identity.identity,
    startHash
  );
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data.length === 0;
  const isReachingEnd = isEmpty || (data && data.length < PAGE_SIZE);
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    const lastData = localStorage.getItem("feeds") || [];
    const scrollLoad = (e) => {
      const scrollHeight = e.target.scrollHeight;
      const scrollTop = e.target.scrollTop;
      const offsetHeight = e.target.offsetHeight;
      if (offsetHeight + scrollTop >= scrollHeight) {
        if (issues.length > 0 && !isLoading) {
          if (isReachingEnd) return;
          const len = issues.length;
          setStartHash(issues[len - 1].hash);
          setSize(size + 1);
        }
      }
    };
    if (lastData && lastData.length > 0) {
      const old = JSON.parse(lastData as string);
      data.map((x) => {
        if (!old.some((y) => y.timestamp === x.timestamp)) {
          old.push(x);
        }
      });
      setIssues(old);
    } else {
      setIssues(data);
    }

    localStorage.setItem("feeds", JSON.stringify(issues));
    if (container) {
      container.addEventListener("scroll", scrollLoad);
    }

    return () => {
      container.removeEventListener("scroll", scrollLoad);
    };
  }, [size, startHash, isValidating, isLoading, isReachingEnd,setSize]);

  return (
    <div className="feeds-container">
      <div className="social-feeds-title">Social Feeds</div>

      <div ref={ref} className="social-feeds-list">
        {isEmpty ? <p>Yay, no feeds.</p> : null}
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
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "10vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isLoadingMore ? (
            <Loading />
          ) : isReachingEnd ? (
            "No More Feeds"
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
};

export const FeedsTab = memo(RenderFeedsTab);
