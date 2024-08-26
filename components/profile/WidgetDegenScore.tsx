"use client";
import { memo, useEffect } from "react";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { useDispatch } from "react-redux";
import { DegenscoreFetcher, DEGENSCORE_ENDPOINT } from "../utils/api";
import { updateDegenscoreWidget } from "../state/widgets/reducer";
import { ModalType } from "../hooks/useModal";

function useDegenInfo(address: string) {
  const { data, error } = useSWR(
    `${DEGENSCORE_ENDPOINT}${address}`,
    DegenscoreFetcher,
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

const RenderWidgetDegenScore = ({ profile, openModal }) => {
  const { data, isLoading } = useDegenInfo(profile.address);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateDegenscoreWidget({
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
    <div
      className="profile-widget profile-widget-degenscore"
      onClick={() => {
        openModal(ModalType.degenscore, {
          degenscore: data,
          profile,
        });
      }}
    >
      <div className="profile-widget-header">
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">
            {WidgetInfoMapping(WidgetType.degenscore).icon}{" "}
          </span>
          {WidgetInfoMapping(WidgetType.degenscore).title}{" "}
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
    </div>
  );
};

export const WidgetDegenScore = memo(RenderWidgetDegenScore);
