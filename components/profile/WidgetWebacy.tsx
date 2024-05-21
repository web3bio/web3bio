"use client";
import { memo } from "react";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import useSWR from "swr";
import {
  WEBACY_API_ENDPOINT,
  webacyFetcher,
  WBEACY_DAPP_ENDPOINT,
} from "../apis/webacy";

const RenderWidgetWebacy = ({ address }) => {
  const { data, isLoading } = useSWR(
    WEBACY_API_ENDPOINT + "/quick-profile/" + address,
    webacyFetcher
  );

  if (!data) return null;

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
