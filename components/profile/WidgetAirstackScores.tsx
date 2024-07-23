"use client";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { QUERY_FARCASTER_STATS } from "../apis/airstack";
import { ModalType } from "../hooks/useModal";
import { PlatformType } from "../utils/platform";
import { updateAirstackScoresWidget } from "../state/widgets/reducer";

export function WidgetAirStackScores({ handle, openModal }) {
  const { data, loading, error } = useQuery(QUERY_FARCASTER_STATS, {
    variables: {
      name: handle,
    },
    context: {
      clientName: "airstack",
    },
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading) {
      dispatch(
        updateAirstackScoresWidget({
          isEmpty: !data?.Socials?.Social?.length,
          initLoading: false,
        })
      );
    }
  }, [data, dispatch, loading]);

  const socialCapital = useMemo(
    () => data?.Socials?.Social?.[0]?.socialCapital,
    [data]
  );

  if ((!loading && !socialCapital) || error) return null;
  return (
    socialCapital && (
      <div
        className="profile-widget profile-widget-airstack"
        onClick={() => {
          openModal(ModalType.profile, {
            platform: PlatformType.farcaster,
            handle: handle,
          });
        }}
      >
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.airstackScores).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetTypes.airstackScores).title}{" "}
          </h2>
        </div>

        <div className="profile-widget-body"></div>

        <div className="profile-widget-footer">
          <div className="widget-rank-number">
            {Number(socialCapital?.socialCapitalScore).toFixed(2)}
            <div
              className={`widget-rank-label ${
                socialCapital?.socialCapitalRank < 50 ? "high-rank" : "low-rank"
              }`}
            >
              Rank: {socialCapital?.socialCapitalRank}
            </div>
          </div>
          <div
            className="widget-risk-title"
            title="Social Capital Scores (SCS) are a measure of each Farcaster user's influence in the network."
          >
            Airstack Social Score <span className="c-hand">&#9432;</span>
          </div>
        </div>
      </div>
    )
  );
}
