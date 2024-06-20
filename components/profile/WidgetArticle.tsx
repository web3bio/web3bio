"use client";
import { useEffect, memo, useMemo } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { WidgetTypes } from "../utils/widgets";
import RssItem from "./RssItem";
import { profileAPIBaseURL } from "../utils/queries";
import { updateArticleWidget } from "../state/widgets/action";
import { ArticlesFetcher } from "../apis/articles";

function useRSS(domain: string) {
  const fetchUrl = (() => {
    return `${profileAPIBaseURL}/articles/${domain}?limit=10`;
  })();
  const { data, error, isValidating } = useSWR(fetchUrl, ArticlesFetcher, {
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

const RenderWidgetArticles = ({ domain }) => {
  const { data, isLoading } = useRSS(domain);
  console.log(data, "data");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateArticleWidget({
          isEmpty: !data?.items?.length,
          initLoading: false,
        })
      );
    }
  }, [data, isLoading, dispatch]);
  const siteInfo = useMemo(() => {
    return data?.sites[0];
  }, [data?.sites]);
  if (!siteInfo || !data?.items?.length) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Article Data:", data);
  // }

  return (
    <div className="profile-widget-full" id={WidgetTypes.article}>
      <div className="profile-widget profile-widget-rss">
        {
          <div className="profile-widget-header">
            <h2 className="profile-widget-title">
              <span className="emoji-large mr-2">🌐 </span>
              {siteInfo.platform}
            </h2>
            {siteInfo.description && (
              <h3 className="text-assistive">{siteInfo.description}</h3>
            )}
          </div>
        }

        <div className="widget-rss-list noscrollbar">
          <div className="widget-hero">
            <div className="widget-hero-title mb-1">{siteInfo.name}</div>
            <div className="widget-hero-description mb-4">
              {siteInfo.description}
            </div>
            <div className="widget-hero-action">
              <Link
                className="btn btn-sm"
                title="More Articles"
                href={siteInfo.link}
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

export const WidgetArticle = memo(RenderWidgetArticles);
