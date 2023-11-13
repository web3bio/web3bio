"use client";
import { memo, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { RSS3Fetcher, RSS3_ENDPOINT } from "../apis/rss3";
import { SocialFeeds } from "./SocialFeeds";
import { ActivityType, TagsFilterMapping } from "../../utils/activity";
import FeedFilter from "./FeedFilter";

const FEEDS_PAGE_SIZE = 20;

const processFeedsData = (data) => {
  if (!data?.[0]?.data?.length) return [];
  const res = new Array();
  data.map((x) => {
    x.data?.forEach((i) => {
      res.push(i);
    });
  });

  return res;
};

const getURL = (index, address, previous, filter) => {
  const cursor = previous?.meta?.cursor;
  if (index !== 0 && !(previous?.result?.length || cursor)) return null;
  const url = RSS3_ENDPOINT + `/data/accounts/activities`;
  const data = {
    account: [address],
    limit: FEEDS_PAGE_SIZE,
    status: "successful",
    direction: "out",
    cursor,
    tag: TagsFilterMapping[filter].filters,
    type: [
      ActivityType.approval,
      ActivityType.auction,
      ActivityType.bridge,
      ActivityType.claim,
      ActivityType.comment,
      ActivityType.donate,
      ActivityType.liquidity,
      ActivityType.loan,
      ActivityType.mint,
      ActivityType.multisig,
      ActivityType.post,
      ActivityType.profile,
      ActivityType.propose,
      ActivityType.revise,
      ActivityType.reward,
      ActivityType.share,
      ActivityType.staking,
      ActivityType.swap,
      ActivityType.trade,
      ActivityType.transfer,
      ActivityType.vote,
    ],
  };
  return [url, data];
};

function useFeeds({ address, fromServer, initialData, filter }) {
  const options = fromServer
    ? {
        initialSize: 1,
        fallbackData: [initialData],
      }
    : {};
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous, filter),
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
  const [filter, setFilter] = useState("all");
  const { data, size, setSize, isValidating, isError, hasNextPage } = useFeeds({
    address: profile.address,
    fromServer,
    initialData,
    filter,
  });

  const scrollContainer = useRef(null);

  useEffect(() => {
    if (expand) {
      const anchorElement = document.getElementById("feeds");
      anchorElement?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  
  }, [expand]);

  if ((!isValidating && !data?.length) || isError) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Feed Data:", data);
  // }

  return (
    <div ref={scrollContainer} className="profile-widget-full" id="feeds">
      <div
        className={`profile-widget profile-widget-feeds${
          expand ? " active" : ""
        }`}
      >
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">🌈 </span>
            Activity Feeds
          </h2>
          <div className="widget-action">
            <FeedFilter value={filter} onChange={(v) => setFilter(v)} />
            <ExpandController
              expand={expand}
              onToggle={() => {
                setExpand(!expand);
              }}
            />
          </div>
        </div>

        <SocialFeeds
          expand={expand}
          parentScrollRef={scrollContainer}
          identity={profile}
          data={data}
          isLoadingMore={isValidating}
          hasNextPage={hasNextPage}
          isError={isError}
          getNext={() => {
            if (isValidating || !hasNextPage) return;
            setSize(size + 1);
          }}
        />
        {!isValidating && !expand && data?.length > 2 && (
          <div
            className="btn-widget-more"
            onClick={() => {
              setExpand(true);
            }}
          >
            <button className="btn btn-block">View more</button>
          </div>
        )}
        {expand && (
          <div className="profile-widget-footer">
            Powered by <strong>RSS3</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export const WidgetFeed = memo(RenderWidgetFeed);
