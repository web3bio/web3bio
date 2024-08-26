"use client";
import { memo, useEffect } from "react";
import useSWR from "swr";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { useDispatch } from "react-redux";
import { updateGitcoinWidget } from "../state/widgets/reducer";
import { ProfileFetcher } from "../utils/api";
import { ModalType } from "../hooks/useModal";

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

const RenderWidgetGitcoin = ({ profile, openModal }) => {
  const { data, isLoading } = useGitcoinInfo(profile.address);
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
    <div
      className="profile-widget profile-widget-gitcoin"
      onClick={() => {
        openModal(ModalType.gitcoin, {
          profile,
          passport: data,
        });
      }}
    >
      <div className="profile-widget-header">
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">
            {WidgetInfoMapping(WidgetType.gitcoin).icon}{" "}
          </span>
          {WidgetInfoMapping(WidgetType.gitcoin).title}{" "}
        </h2>
      </div>
      <div className="profile-widget-body"></div>

      <div className="profile-widget-footer">
        <div className="widget-score-title">{data.score}</div>
        <div
          className="widget-score-subtitle"
          title="Humanity Score is based out of 100 and measures identity's uniqueness. The current passing threshold is 20."
        >
          Humanity Score
        </div>
      </div>
    </div>
  );
};

export const WidgetGitcoin = memo(RenderWidgetGitcoin);
