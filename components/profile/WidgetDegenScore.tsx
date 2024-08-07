"use client";
import { memo, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useDispatch } from "react-redux";
import { updateDegenWidget } from "../state/widgets/reducer";
import { DegenFetcher, DEGENSCORE_ENDPOINT } from "../apis";

function useDegenInfo(address: string) {
  const { data, error } = useSWR(
    `${DEGENSCORE_ENDPOINT}${address}`,
    DegenFetcher,
    {
      suspense: true,
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderWidgetDegenScore = ({ address }) => {
  const { data, isLoading } = useDegenInfo(address);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateDegenWidget({
          isEmpty: !data?.name,
          initLoading: false,
        })
      );
    }
  }, [data, dispatch, isLoading]);
  if (!isLoading && !data?.name) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("DegenScore Data:", data);
  // }

  return isLoading ? (
    <></>
  ) : (
    <Link
      className="profile-widget profile-widget-degenscore"
      href={data?.external_url}
      target="_blank"
    >
      <div className="profile-widget-header">
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">
            {WidgetInfoMapping(WidgetTypes.degen).icon}{" "}
          </span>
          {WidgetInfoMapping(WidgetTypes.degen).title}{" "}
        </h2>
      </div>
      <div className="profile-widget-body"></div>

      <div className="profile-widget-footer">
        <div className="widget-score-title">{data.properties?.DegenScore}</div>
        <div className="widget-score-subtitle">
          Updated:{" "}
          {formatDistanceToNow(new Date(data?.updatedAt), {
            addSuffix: true,
          })}
        </div>
      </div>

      {data.traits.actions?.metadata.actions.actions && (
        <div className="profile-widget-hover">
          <div className="widget-trait-list">
            {(data.traits.actions?.metadata.actions.actions).map(
              (item, idx) => {
                return (
                  <div
                    key={idx}
                    className={`trait-item label ${item.actionTier?.toLowerCase()}`}
                    title={item.description}
                  >
                    {item.actionTier == "ACTION_TIER_LEGENDARY" && "💎 "}
                    {item.actionTier == "ACTION_TIER_EPIC" && "✨ "}
                    {item.name}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export const WidgetDegenScore = memo(RenderWidgetDegenScore);
