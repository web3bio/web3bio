"use client";
import useSWR from "swr";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateWebacyWidget } from "../state/widgets/action";
import { GITCOIN_PASSPORT_API_END_POINT, gitcoinFetcher } from "../apis/gitcoin";

export function WidgetGitcoin({ address }) {

  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (!isLoading) {
  //     dispatch(
  //       updateWebacyWidget({
  //         isEmpty: isNaN(data?.overallRisk),
  //         initLoading: false,
  //       })
  //     );
  //   }
  // }, [data, dispatch, isLoading]);

  // if (!isLoading && isNaN(data?.overallRisk)) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Webacy Data:", data);
  // }

  return true ? (
    <></>
  ) : (
    <div className="profile-widget profile-widget-webacy">
      <div className="profile-widget-header">
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">
            {WidgetInfoMapping(WidgetTypes.webacy).icon}{" "}
          </span>
          {WidgetInfoMapping(WidgetTypes.webacy).title}{" "}
        </h2>
      </div>

      <div className="profile-widget-body"></div>

      <div className="profile-widget-footer">
        <div className="widget-risk-number">
          {Number(data?.overallRisk).toFixed(2)}
          <div
            className={`widget-risk-label ${
              data?.high > 0
                ? "high-risk"
                : data?.medium > 0
                ? "medium-risk"
                : "low-risk"
            }`}
          >
            {data?.high > 0
              ? "High Risk"
              : data?.medium > 0
              ? "Medium Risk"
              : "Low Risk"}
          </div>
        </div>
        <div className="widget-risk-title">Safety Score</div>
      </div>
    </div>
  );
}
