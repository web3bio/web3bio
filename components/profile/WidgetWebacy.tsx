"use client";
import { memo } from "react";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import useSWR from "swr";
import { WEBACY_API_ENDPOINT, webacyFetcher } from "../apis/webacy";

const RenderWidgetWebacy = ({ address }) => {
  const { data, isLoading } = useSWR(
    WEBACY_API_ENDPOINT + "/api/risk/address/" + address,
    webacyFetcher
  );
  console.log(data, "webacy");
  if (!data) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Phi:", data);
  // }

  return (
    <div className="profile-widget-half" id={WidgetTypes.webacy}>
      <div className="profile-widget profile-widget-webacy">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.webacy).icon}
            </span>
            {WidgetInfoMapping(WidgetTypes.webacy).title}
          </h2>
        </div>
        <div className="profile-widget-body">webacy</div>
      </div>
    </div>
  );
};

export const WidgetWebacy = memo(RenderWidgetWebacy);
