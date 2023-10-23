"use client";
import { memo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { RSS3Fetcher, RSS3_ENDPOINT } from "../apis/rss3";

const getURL = (index, address, previous) => {
  if (
    index !== 0 &&
    previous &&
    (!previous?.data.length || !previous?.meta.cursor)
  )
    return null;
  const cursor = previous?.meta.cursor || "";
  return (
    RSS3_ENDPOINT +
    `data/accounts/${address}/activities?limit=10${
      cursor ? "&cursor=" + cursor : ""
    }&action_limit=10`
  );
};

function useFeeds({ address }) {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous),
    RSS3Fetcher,
    {
      suspense: false,
      //   fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    hasNextPage: !!data?.[data.length - 1]?.meta?.cursor,
    data: data,
    isLoading: !error && !data,
    isError: error,
    size,
    isValidating,
    setSize,
  };
}

const RenderWidgetFeed = ({ address }) => {
  const { data, size, setSize, isValidating, isError, hasNextPage } = useFeeds({
    address,
  });
  const [expand, setExpand] = useState(false);

  const scrollContainer = useRef(null);
  console.log(data, "kkk");
  if (!data || isError) return null;

  return (
    <div ref={scrollContainer} className="profile-widget-full" id="nft">
      <div
        className={`profile-widget profile-widget-nft${
          expand ? " active" : ""
        }`}
      >
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">🌈 </span>
          Social Feeds
        </h2>
        <ExpandController
          expand={expand}
          onToggle={() => {
            setExpand(!expand);
          }}
        />
        2224
        {/* <FeedsTab address={address} network={PlatformType.ethereum} /> */}
      </div>
    </div>
  );
};

export const WidgetFeed = memo(RenderWidgetFeed);
