"use client";
import { memo, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { RSS3Fetcher, RSS3_ENDPOINT } from "../apis/rss3";
import { SocialFeeds } from "./SocialFeeds";

const FEEDS_PAGE_SIZE = 20;

const processFeedsData = (data) => {
  if (!data?.[0]?.data?.length) return [];
  const res = new Array();
  data.map((x) => {
    x.data.forEach((i) => {
      res.push(i);
    });
  });

  return res;
};

const getURL = (index, address, previous) => {
  const cursor = previous?.meta?.cursor;
  if (index !== 0 && !(previous?.data?.length || cursor)) return null;
  return (
    RSS3_ENDPOINT +
    `data/accounts/` +
    address +
    `/activities?limit=${FEEDS_PAGE_SIZE}${
      cursor ? `&cursor=${cursor}` : ""
    }&direction=out&status=successful`
  );
};

function useFeeds({ address, fromServer, initialData }) {
  const options = fromServer
    ? {
        initialSize: 1,
        fallbackData: [initialData],
      }
    : {};
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous),
    RSS3Fetcher,
    {
      ...options,
      suspense: !fromServer,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
    }
  );

  return {
    hasNextPage: !!data?.[data.length - 1]?.meta?.cursor,
    data: processFeedsData(data),
    isError: error,
    size,
    isValidating,
    setSize,
  };
}

const RenderWidgetFeed = ({ profile, fromServer, initialData }) => {
  const [expand, setExpand] = useState(false);

  const { data, size, setSize, isValidating, isError, hasNextPage } = useFeeds({
    address: profile.address,
    fromServer,
    initialData,
  });

  const scrollContainer = useRef(null);

  const issues = !data?.length
    ? []
    : expand
    ? JSON.parse(JSON.stringify(data))
    : JSON.parse(JSON.stringify(data.slice(0, 1)));
  useEffect(() => {
    if (expand) {
      const anchorElement = document.getElementById("feeds");
      anchorElement?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [expand]);

  if (!issues?.length || isError) return null;

  if (process.env.NODE_ENV !== "production") {
    console.log("raw:", data, "\nrendered:\n", issues);
  }

  return (
    <div ref={scrollContainer} className="profile-widget-full" id="feeds">
      <div
        className={`profile-widget profile-widget-feeds${
          expand ? " active" : ""
        }`}
      >
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">🌈 </span>
          Activity Feeds
        </h2>
        <ExpandController
          expand={expand}
          onToggle={() => {
            setExpand(!expand);
          }}
        />
        <SocialFeeds
          expand={expand}
          parentScrollRef={scrollContainer}
          identity={profile}
          data={issues}
          isLoadingMore={isValidating}
          hasNextPage={hasNextPage}
          isError={isError}
          getNext={() => {
            if (isValidating || !hasNextPage) return;
            setSize(size + 1);
          }}
        />
      </div>
    </div>
  );
};

export const WidgetFeed = memo(RenderWidgetFeed);
