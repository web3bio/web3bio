"use client";
import { memo, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { RSS3Fetcher, RSS3_ENDPOINT } from "../apis/rss3";
import { PlatformType } from "../../utils/platform";
import { SocialFeeds } from "./SocialFeeds";
import { Networks, Tag } from "../apis/rss3/types";

const FEEDS_PAGE_SIZE = 10;

const processFeedsData = (data) => {
  if (!data?.[0]?.result?.length) return { total: 0, results: [] };
  const issues = new Array();
  data.map((x) => {
    x.result.forEach((i) => {
      issues.push(i);
    });
  });
  return {
    total: data?.[0]?.total,
    results: issues,
  };
};

const getURL = (index, address, previous) => {
  const cursor = previous?.cursor;
  if (index !== 0 && !(previous?.result?.length || cursor)) return null;
  const url = RSS3_ENDPOINT + `/notes`;
  const data = {
    address: [address],
    limit: FEEDS_PAGE_SIZE,
    network: [
      Networks.Ethereum,
      Networks.Farcaster,
      Networks.Matic,
      Networks.Arweave,
    ],
    cursor,
    query_status: true,
    refresh: true,
    tag: [
    //   Tag.Social,
    //   Tag.Transaction,
    //   Tag.Collectible,
    //   Tag.Exchange,
      Tag.Donation,
    //   Tag.Governance,
    //   Tag.MetaVerse,
    ],
  };
  return [url, data];
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
    hasNextPage: !!data?.[data.length - 1]?.cursor,
    data: processFeedsData(data),
    isLoading: !error && !data,
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

  const issues = !data?.results?.length
    ? []
    : expand
    ? JSON.parse(JSON.stringify(data.results))
    : JSON.parse(JSON.stringify(data.results.slice(0, 3)));
  useEffect(() => {
    if (expand) {
      const anchorElement = document.getElementById("feeds");
      anchorElement?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [expand]);
  if (!issues?.length || isError) return null;

  return (
    <div ref={scrollContainer} className="profile-widget-full" id="feeds">
      <div
        className={`profile-widget profile-widget-nft${
          expand ? " active" : ""
        }`}
      >
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">🌈 </span>
          Social Feeds
          <span className="label ml-2">{data.total}</span>
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
          network={PlatformType.ethereum}
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
