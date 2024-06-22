"use client";
import { useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { RSS3Fetcher, RSS3_ENDPOINT } from "../apis/rss3";
import {
  ActivityTag,
  ActivityType,
  TagsFilterMapping,
} from "../utils/activity";
import FeedFilter from "./FeedFilter";
import { useDispatch } from "react-redux";
import { updateFeedsWidget } from "../state/widgets/action";
import { ActivityFeeds } from "./ActivityFeeds";
import { PlatformType } from "../utils/platform";
import { isSameAddress } from "../utils/utils";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";

const processFeedsData = (data) => {
  if (!data?.[0]?.data?.length) return [];
  const res = new Array();
  const publicationIds = new Array();
  const updateRecords = new Array();
  JSON.parse(JSON.stringify(data)).map((x) => {
    x.data?.forEach((i) => {
      if (
        i.tag === TagsFilterMapping.social.filters[0] &&
        i.actions?.length > 0
      ) {
        i.actions.forEach((j, idx) => {
          if (j.metadata.publication_id) {
            if (!publicationIds.includes(j.metadata.publication_id)) {
              publicationIds.push(j.metadata.publication_id);
            } else {
              i.actions[idx] = null;
            }
          }
          if (
            j.metadata.action === "update" &&
            j.platform === PlatformType.ens
          ) {
            if (
              !updateRecords.find(
                (x) => x.key === j.metadata.key && x.value === j.metadata.value
              )
            ) {
              updateRecords.push({
                key: j.metadata.key,
                value: j.metadata.value || "",
              });
            } else {
              i.actions[idx] = null;
            }
          }
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

function useFeeds({ address, filter }) {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous, filter),
    RSS3Fetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
    }
  );
  return {
    hasNextPage: !!data?.[data.length - 1]?.meta?.cursor,
    data: processFeedsData(data).filter((x) => {
      if (x.tag === ActivityTag.transaction && !isSameAddress(x.from, address))
        return false;
      return true;
    }),
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
                setFilter(v);
                setExpand(true);
              }}
            />
            <ExpandController
              expand={expand}
              onToggle={() => {
                setExpand(!expand);
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
            <button className="btn btn-block">View More</button>
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
