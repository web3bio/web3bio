import { memo, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { formatTimestamp } from "../../utils/date";
import { PlatformType } from "../../utils/type";
import { debounce } from "../../utils/utils";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { FeedItem, isSupportedFeed } from "./components/FeedItem";

const PAGE_SIZE = 30;
const getFeedsURL = (
  address: string,
  startHash?: string,
  network?: string,
  previousPageData?
) => {
  if (previousPageData && !previousPageData.length) return null;
  return (
    RSS3_END_POINT +
    `notes/${address}?limit=${PAGE_SIZE}${
      startHash ? `&cursor=${startHash}` : ""
    }&&include_poap=true&count_only=false&network=${
      network === PlatformType.lens ? "polygon" : "ethereum"
    }&query_status=false`
  );
};

function useFeeds(address: string, startHash?: string, network?: string) {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    () => getFeedsURL(address, startHash, network),
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
  const { identity, network } = props;
  const [startHash, setStartHash] = useState("");
  const [issues, setIssues] = useState([]);
  const { data, error, size, setSize, isValidating, isLoading } = useFeeds(
    network === PlatformType.lens ? identity.ownedBy : identity.identity,
    startHash,
    network
  );
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data.length === 0;
  const isReachingEnd = isEmpty || (data && data.length < PAGE_SIZE);
  const ref = useRef(null);
  const lastData = localStorage.getItem("feeds") || [];

  useEffect(() => {
    let rendering = false;
    const container = ref.current;
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

    const scrollLoad = (e) => {
      const scrollHeight = e.target.scrollHeight;
      const scrollTop = e.target.scrollTop;
      const offsetHeight = e.target.offsetHeight;
      if (offsetHeight + scrollTop >= scrollHeight) {
        if (data.length > 0 && !isValidating && !isLoading && !rendering) {
          if (isReachingEnd) return;
          const copy = issues.length > 0 ? issues : data;
          const len = copy.length;
          setStartHash(copy[len - 1].hash);
          setSize(size + 1);
          rendering = true;
        }
      }
    };

    localStorage.setItem("feeds", JSON.stringify(issues));
    if (container) {
      container.addEventListener("scroll", debounce(scrollLoad, 500));
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", debounce(scrollLoad, 500));
      }
    };
  }, [
    startHash,
    isValidating,
    setStartHash,
    setSize,
    isLoading,
    size,
    isReachingEnd,
  ]);
  if (isLoading && !lastData) return <Loading />;
  if (error) return <Error text={error} />;
  if (!data) return <Empty text="No Feeds" />;
  return (
    <div ref={ref} className="feeds-container">
      <div className="social-feeds-list">
        {issues.map(
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
