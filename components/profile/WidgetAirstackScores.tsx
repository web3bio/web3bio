"use client";
import useSWR from "swr";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAirstackScoresWidget } from "../state/widgets/action";
import { useQuery } from "@apollo/client";
import { QUERY_FARCASTER_STATS } from "../apis/airstack";

export function WidgetAirStackScores({ handle }) {
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

  const socialCaptial = data?.Socials?.Social?.[0]?.socialCaptial;
  if (!loading && !socialCaptial) return null;

  return loading ? (
    <></>
  ) : (
    <div className="profile-widget profile-widget-webacy">
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
        <div className="widget-risk-number">
          {Number(socialCaptial?.socialCapitalScore).toFixed(2)}
          <div
            className={`widget-risk-label ${
              socialCaptial?.socialCapitalRank < 10
                ? "high-risk"
                : socialCaptial?.socialCapitalRank < 100
                ? "medium-risk"
                : "low-risk"
            }`}
          >
            {socialCaptial?.socialCapitalRank}
          </div>
        </div>
        <div className="widget-risk-title">Social Captial Scores</div>
      </div>
    </div>
  );
}
