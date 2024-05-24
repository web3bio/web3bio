"use client";
import { memo } from "react";
import useSWR from "swr";
import { DegenFetcher, DEGENSCORE_ENDPOINT } from "../apis/degenscore";
import SVG from "react-inlinesvg";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { Loading } from "../shared/Loading";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

function useDegenInfo(address: string) {
  const { data, error } = useSWR(
    `${DEGENSCORE_ENDPOINT}${address}`,
    DegenFetcher,
    {
      suspense: true,
      fallbackData: [],
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

const RenderWidgetDegenScore = ({ address }) => {
  const { data, isLoading } = useDegenInfo(address);
  if (!data || !data.name) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("DegenScore Data:", data);
  // }

  return (
    <div className="rss-item">
      <div className="rss-item-tag">
        <span className="label text-dark">
          <SVG
            fill={"#121212"}
            src={SocialPlatformMapping(PlatformType.degenscore).icon || ""}
            height={18}
            width={18}
            className="mr-1"
          />
          {SocialPlatformMapping(PlatformType.degenscore).label}
        </span>
      </div>
      <div className="rss-item-title">
        {isLoading ? (
          <Loading />
        ) : (
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.degen).icon}{" "}
            </span>
            DegenScore{" "}
            <span className="label ml-2">{data.properties?.DegenScore}</span>
          </h2>
        )}
      </div>
      {data.traits.actions?.metadata.actions.actions && (
        <div className="widget-trait-list">
          {(data.traits.actions?.metadata.actions.actions).map((item, idx) => {
            return (
              <div
                key={idx}
                className={`trait-item ${item.actionTier?.toLowerCase()}`}
                title={item.description}
              >
                <div className="trait-item-bg">
                  <div className="trait-label">
                    {item.actionTier == "ACTION_TIER_LEGENDARY" && (
                      <div className="value">💎</div>
                    )}
                    {item.actionTier == "ACTION_TIER_EPIC" && (
                      <div className="value">&#127942;</div>
                    )}
                  </div>
                  <div className="trait-name">{item.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const WidgetDegenScore = memo(RenderWidgetDegenScore);
