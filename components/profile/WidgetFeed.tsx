"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import {
  ActivityTag,
  ActivityType,
  TagsFilterMapping,
} from "../utils/activity";
import FeedFilter from "./FeedFilter";
import { useDispatch } from "react-redux";
import { ActivityFeeds } from "./ActivityFeeds";
import { PlatformType } from "../utils/platform";
import { isSameAddress } from "../utils/utils";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { updateFeedsWidget } from "../state/widgets/reducer";
import { RSS3_ENDPOINT, RSS3Fetcher } from "../apis";

const processFeedsData = (data) => {
  if (!data?.[0]?.data?.length) return [];
  const res = new Array();
  const publicationIds = new Set();
  const updateRecords = new Map();

  data.forEach((x) => {
    x.data?.forEach((i) => {
      if (
        i.tag === TagsFilterMapping.social.filters[0] &&
        i.actions?.length > 0
      ) {
        i.actions = i.actions.filter((j) => {
          if (j.metadata.publication_id) {
            if (!publicationIds.has(j.metadata.publication_id)) {
              publicationIds.add(j.metadata.publication_id);
              return true;
            }
            return false;
          }
          if (
            j.metadata.action === "update" &&
            j.platform === PlatformType.ens
          ) {
            const key = `${j.metadata.key}-${j.metadata.value}`;
            if (!updateRecords.has(key)) {
              updateRecords.set(key, true);
              return true;
            }
            return false;
          }
          return true;
        });
      }
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
    limit: 20,
    action_limit: 20,
    status: "successful",
    direction: "out",
    cursor,
    tag: TagsFilterMapping[filter].filters,
    type: [
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
      ActivityType.share,
      ActivityType.swap,
      ActivityType.trade,
      ActivityType.transfer,
      ActivityType.vote,
    ],
  };
  return [url, data];
};

function useFeeds({ address, filter }) {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous, filter),
    RSS3Fetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const processedData = useMemo(() => {
    const processed = processFeedsData(data);
    return processed.filter(
      (x) =>
        !(x.tag === ActivityTag.transaction && !isSameAddress(x.from, address))
    );
  }, [data, address]);

  return {
    hasNextPage: !!data?.[data.length - 1]?.meta?.cursor,
    data: processedData,
    isError: error,
    size,
    isValidating,
    setSize,
  };
}

export default function WidgetFeed({ profile, openModal }) {
  const [expand, setExpand] = useState(false);
  const [filter, setFilter] = useState("all");
  const { data, size, setSize, isValidating, isError, hasNextPage } = useFeeds({
    address: profile.address,
    filter,
  });

  const dispatch = useDispatch();
  const scrollContainer = useRef(null);

  useEffect(() => {
    if (
      window.location.hash &&
      window.location.hash === `#${WidgetTypes.feeds}` &&
      !expand
    ) {
      setExpand(true);
    }
  }, []);
  useEffect(() => {
    if (expand) {
      const anchorElement = document.getElementById(WidgetTypes.feeds);
      anchorElement?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
    if (!isValidating) {
      dispatch(
        updateFeedsWidget({ isEmpty: !data?.length, initLoading: false })
      );
    }
  }, [expand, isValidating, data?.length, dispatch]);
  const handleFilterChange = useCallback((v) => {
    setFilter(v);
    setExpand(true);
  }, []);

  const handleExpandToggle = useCallback(() => {
    setExpand((prev) => !prev);
  }, []);

  const handleGetNext = useCallback(() => {
    if (isValidating || !hasNextPage) return;
    setSize((prevSize) => prevSize + 1);
  }, [isValidating, hasNextPage, setSize]);
  if (filter === "all" && !data?.length) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Feed Data:", data);
  // }

  return (
    <div
      ref={scrollContainer}
      className="profile-widget-full"
      id={WidgetTypes.feeds}
    >
      <div
        className={`profile-widget profile-widget-feeds${
          expand ? " active" : ""
        }`}
      >
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.feeds).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetTypes.feeds).title}
          </h2>
          <div className="widget-action">
            <FeedFilter
              value={filter}
              onChange={(v) => {
                handleFilterChange(v);
              }}
            />
            <ExpandController
              expand={expand}
              onToggle={() => {
                handleExpandToggle();
              }}
            />
          </div>
        </div>

        <ActivityFeeds
          openModal={openModal}
          expand={expand}
          parentScrollRef={scrollContainer}
          identity={profile}
          data={data}
          isLoadingMore={isValidating}
          hasNextPage={hasNextPage}
          isError={isError}
          getNext={() => {
            handleGetNext();
          }}
        />
        {!isValidating && !expand && data?.length > 2 && (
          <div
            className="btn-widget-more"
            onClick={() => {
              setExpand(true);
            }}
          >
            <button className="btn btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
              View More
            </button>
          </div>
        )}
        {expand && (
          <div className="profile-widget-about">
            Powered by <strong>RSS3</strong>
          </div>
        )}
      </div>
    </div>
  );
}
