"use client";
import { memo, useEffect } from "react";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { updateGitcoinWidget } from "../state/widgets/action";
import { useDispatch } from "react-redux";
import { ProfileFetcher } from "../apis/profile";

function useGitcoinInfo(address: string) {
  const { data, error } = useSWR(
    `/api/metadata/gitcoin/${address}`,
    ProfileFetcher,
    {
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

const RenderWidgetGitcoin = ({ address }) => {
  const { data, isLoading } = useGitcoinInfo(address);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateGitcoinWidget({
          isEmpty: !data.score,
          initLoading: false,
        })
      );
    }
  }, [data, dispatch, isLoading]);
  if (!isLoading && !data?.score) return null;

  //   if (process.env.NODE_ENV !== "production") {
  //     console.log("Gitcoin Data:", data);
  //   }

  return isLoading ? (
    <></>
  ) : (
    <div className="profile-widget profile-widget-gitcoin">
      <div className="profile-widget-header">
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">
            {WidgetInfoMapping(WidgetTypes.gitcoin).icon}{" "}
          </span>
          {WidgetInfoMapping(WidgetTypes.gitcoin).title}{" "}
        </h2>
      </div>
      <div className="profile-widget-body"></div>

      <div className="profile-widget-footer">
        <div className="widget-gitcoin-number">{data.score}</div>
        <div className="widget-gitcoin-title" title="Humanity Score is based out of 100 and measures identity's uniqueness. The current passing threshold is 20.">
          Humanity Score &#9432;
        </div>
      </div>

      {data.stamps && (
        <div className="profile-widget-hover">
          <div className="widget-trait-list">
            {data.stamps.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`trait-item label ${item.type?.toLowerCase()} ${item.weight >= 2 && "label-tier-rare"}`}
                  title={item.label}
                >
                  {item.weight >= 2 && "💎 "}
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const WidgetGitcoin = memo(RenderWidgetGitcoin);
