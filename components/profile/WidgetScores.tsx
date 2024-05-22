"use client";
import { memo, useEffect } from "react";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import useSWR from "swr";
import { WEBACY_API_ENDPOINT, webacyFetcher } from "../apis/webacy";
import { useDispatch } from "react-redux";
import { updateScoresWidget } from "../state/widgets/action";

const RenderWidgetScores = ({ address }) => {
  const { data, isLoading } = useSWR(
    WEBACY_API_ENDPOINT + "/addresses/" + address,
    webacyFetcher
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateScoresWidget({
          isEmpty: isNaN(data?.overallRisk),
          initLoading: false,
        })
      );
    }
  }, [data, isLoading, dispatch]);
  console.log(data, "webacy");
  if (!data) return null;

  return (
    <div className="profile-widget-half" id={WidgetTypes.scores}>
      <div className="profile-widget profile-widget-scores">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.scores).icon}
            </span>
            {WidgetInfoMapping(WidgetTypes.scores).title}
          </h2>
        </div>
        <div className="profile-widget-body">
          Risk: {Number(data?.overallRisk).toFixed(2)}
          <div className="profile-risk-items">
            {data?.issues.map((x) => {
              return x.tags.map((i) => {
                return <div key={i.key}>🚨 {i.description}</div>;
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WidgetScores = memo(RenderWidgetScores);
