"use client";
import { memo, useEffect, useMemo } from "react";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import useSWR from "swr";
import { WEBACY_API_ENDPOINT, webacyFetcher } from "../apis/webacy";
import { useDispatch } from "react-redux";
import { updateScoresWidget } from "../state/widgets/action";
import { DEGENSCORE_ENDPOINT, DegenFetcher } from "../apis/degenscore";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import SVG from "react-inlinesvg";
import { isValidEthereumAddress } from "../utils/utils";
import { regexSolana } from "../utils/regexp";

function useWebcyInfo(address: string) {
  const { data, error } = useSWR(
    `${WEBACY_API_ENDPOINT}/addresses/${address}?chain=${
      regexSolana.test(address) ? "sol" : "eth"
    }`,
    webacyFetcher
  );
  return {
    webacyInfo: data,
    webacyLoading: !error && !data,
    webacyError: error,
  };
}

function useDegenInfo(address: string) {
  const { data, error } = useSWR(
    (isValidEthereumAddress(address) && `${DEGENSCORE_ENDPOINT}${address}`) ||
      null,
    DegenFetcher
  );
  return {
    degenInfo: data,
    degenLoading: !error && !data,
    degenError: error,
  };
}

const RenderWidgetScores = ({ address }) => {
  const { webacyInfo, webacyLoading } = useWebcyInfo(address);
  const { degenInfo, degenLoading } = useDegenInfo(address);
  const dispatch = useDispatch();
  const isEmpty = isNaN(webacyInfo?.overallRisk) && !degenInfo?.name;
  useEffect(() => {
    if (!degenLoading && !webacyLoading) {
      dispatch(
        updateScoresWidget({
          isEmpty: isEmpty,
          initLoading: false,
        })
      );
    }
  }, [isEmpty, dispatch, webacyLoading, degenLoading]);
  const scoresArr = useMemo(() => {
    const res = new Array();
    if (!isNaN(webacyInfo?.overallRisk)) {
      res.push({
        key: PlatformType.webacy,
        title: SocialPlatformMapping(PlatformType.webacy).label,
        icon: SocialPlatformMapping(PlatformType.degenscore).icon,
        data: { ...webacyInfo },
      });
    }
    if (degenInfo?.name) {
      res.push({
        key: PlatformType.degenscore,
        title: SocialPlatformMapping(PlatformType.degenscore).label,
        icon: SocialPlatformMapping(PlatformType.degenscore).icon,
        data: { ...degenInfo },
      });
    }
    return res;
  }, [webacyInfo, degenInfo]);
  console.log(webacyInfo, degenInfo, "kkk");
  if (isEmpty) return null;
  return (
    <div className="profile-widget-full" id={WidgetTypes.scores}>
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.scores).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetTypes.scores).title}
          </h2>
        </div>

        <div className="widget-rss-list noscrollbar">
          {scoresArr?.map((x, idx) => {
            return (
              <div className="rss-item" key={idx}>
                <div className="rss-item-tag">
                  <span className="label text-dark">
                    <SVG
                      fill={"#121212"}
                      src={SocialPlatformMapping(x.key).icon || ""}
                      height={18}
                      width={18}
                      className="mr-1"
                    />
                    {SocialPlatformMapping(x.key).label}
                  </span>
                </div>
                <div className="rss-item-title">
                  {x.key === PlatformType.degenscore ? (
                    <h2 className="profile-widget-title">
                      <span className="emoji-large mr-2">👾 </span>
                      DegenScore{" "}
                      <span className="label ml-2">
                        {x.data.properties?.DegenScore}
                      </span>
                    </h2>
                  ) : (
                    <h2 className="profile-widget-title">
                      <span className="emoji-large mr-2">🚨 </span>
                      WebacyScore{" "}
                      <span className="label ml-2">
                        {Number(x.data.overallRisk).toFixed(2)}
                      </span>
                    </h2>
                  )}
                </div>
                {/* <time
                  dateTime={x.content_timestamp * 1000 + ""}
                  suppressHydrationWarning
                  className="rss-item-date"
                >
                  {new Date(x.content_timestamp * 1000).toDateString()}
                </time> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const WidgetScores = memo(RenderWidgetScores);
