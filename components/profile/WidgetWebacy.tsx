"use client";
import useSWR from "swr";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateWebacyWidget } from "../state/widgets/action";
import { ProfileFetcher } from "../apis/profile";
import Link from "next/link";

export function WidgetWebacy({ address }) {
  const { data, isLoading } = useSWR(
    `/api/metadata/webacy/${address}`,
    ProfileFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateWebacyWidget({
          isEmpty: isNaN(data?.overallRisk),
          initLoading: false,
        })
      );
    }
  }, [data, dispatch, isLoading]);

  if (!isLoading && isNaN(data?.overallRisk)) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Webacy Data:", data);
  // }

  return isLoading ? (
    <></>
  ) : (
    <Link
      href={"https://dapp.webacy.com/web3bio/" + address}
      className="profile-widget profile-widget-webacy"
      target="_blank"
    >
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
    </Link>
  );
}
