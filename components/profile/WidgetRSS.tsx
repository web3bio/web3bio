"use client";
import { useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { RSSFetcher, RSS_ENDPOINT } from "../apis/rss";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { updateRssWidget } from "../state/widgets/action";
import { WidgetTypes } from "../utils/widgets";
import RssItem from "./RssItem";

function useRSS(domain: string) {
  const fetchUrl = (() => {
    return `${RSS_ENDPOINT}rss?query=${domain}&mode=list`;
  })();
  const { data, error, isValidating } = useSWR(fetchUrl, RSSFetcher, {
    suspense: true,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
  });
  return {
    data: data || [],
    isLoading: isValidating,
    isError: error,
  };
}

const RenderWidgetRSS = ({ domain }) => {
  const { data, isLoading } = useRSS(domain);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateRssWidget({ isEmpty: !data?.items?.length, initLoading: false })
      );
    }
  }, [data, isLoading, dispatch]);

  if (!data || !data?.items?.length) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("RSS Data:", data);
  // }

  return (
    <div className="profile-widget-full" id={WidgetTypes.rss}>
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">🌐 </span>
            Website
          </h2>
          {data.description && (
            <h3 className="text-assistive">{data.description}</h3>
          )}
        </div>

        <div className="widget-rss-list noscrollbar">
          <div className="widget-hero">
            <div className="widget-hero-title mb-1">{data.title}</div>
            <div className="widget-hero-description mb-4">
              {data.description}
            </div>
            <div className="widget-hero-action">
              <Link
                className="btn btn-sm"
                title="More Articles"
                href={data.link}
                target={"_blank"}
              >
                <SVG src="icons/icon-open.svg" width={20} height={20} /> More
              </Link>
            </div>
          </div>
          {data?.items.map((x, idx) => {
            return <RssItem data={x} key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
};

export const WidgetRSS = memo(RenderWidgetRSS);
