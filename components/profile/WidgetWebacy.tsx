"use client";
import useSWR from "swr";
import { WEBACY_API_ENDPOINT, webacyFetcher } from "../apis/webacy";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { regexSolana } from "../utils/regexp";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateWebacyWidget } from "../state/widgets/action";

export function WidgetWebacy({ address }) {
  const { data, error, isLoading } = useSWR(
    `${WEBACY_API_ENDPOINT}/addresses/${address}?chain=${
      regexSolana.test(address) ? "sol" : "eth"
    }`,
    webacyFetcher
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!!data) {
      dispatch(
        updateWebacyWidget({
          isEmpty: isNaN(data?.overallRisk),
          initLoading: false,
        })
      );
    }
  }, [data, dispatch]);

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Webacy Data:", data);
  // }
    
  return (
    data && 
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
          <div className={`widget-risk-label ${data?.high > 0 ? "high-risk" : data?.medium > 0 ? "medium-risk" : "low-risk"}`}>{ data?.high > 0 ? "High Risk" : data?.medium > 0 ? "Medium Risk" : "Low Risk" }</div>
        </div>
        <div className="widget-risk-title">Safety Score</div>
      </div>
    </div>
  );
}
