"use client";
import { memo, useEffect } from "react";
import useSWR from "swr";
import { DegenFetcher, DEGENSCORE_ENDPOINT } from "../apis/degenscore";
import SVG from "react-inlinesvg";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { Loading } from "../shared/Loading";
import { updateDegenWidget } from "../state/widgets/action";
import { useDispatch } from "react-redux";

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
    if (data?.name) {
      dispatch(
        updateDegenWidget({
          isEmpty: false,
          initLoading: false,
        })
      );
    }
  }, [data, dispatch]);
  if (!data || !data.name) return null;

  if (process.env.NODE_ENV !== "production") {
    console.log("DegenScore Data:", data);
  }

  return (
    <div className="profile-widget profile-widget-degenscore">
      <div className="scores-item-title">
        {isLoading ? (
          <Loading />
        ) : (
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.degen).icon}{" "}
            </span>
            DegenScore{" "}
            <span className="label ml-2">{data.properties?.DegenScore}</span>
          </h2>
        )}
      </div>
      {data.traits.actions?.metadata.actions.actions && (
        <div className="widget-trait-list">
          {(data.traits.actions?.metadata.actions.actions).map((item, idx) => {
            return (
              <div
                key={idx}
                className={`trait-item label ${item.actionTier?.toLowerCase()}`}
                title={item.description}
              >
                {item.actionTier == "ACTION_TIER_LEGENDARY" && ("💎 ")}
                {item.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const WidgetDegenScore = memo(RenderWidgetDegenScore);
