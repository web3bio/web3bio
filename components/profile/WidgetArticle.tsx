"use client";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { SocialPlatformMapping } from "../utils/platform";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { ArticlesFetcher, articleAPIBaseURL } from "../utils/api";
import { updateArticleWidget } from "../state/widgets/reducer";
import ArticleItem from "./ArticleItem";

function useArticles(address: string, domain?: string | null) {
  const fetchUrl = (() => {
    return `${articleAPIBaseURL}/${address}?limit=10${
      domain ? "&domian=" + domain + "&contenthash=true" : ""
    }`;
  })();
  const { data, error, isValidating } = useSWR(fetchUrl, ArticlesFetcher, {
    suspense: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data: data || [],
    isLoading: isValidating,
    isError: error,
  };
}

export default function WidgetArticle({ address, domain, openModal, profile }) {
  const { data, isLoading } = useArticles(address, domain);
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
    return data?.sites?.[0];
  }, [data?.sites]);

  if (!siteInfo || !data?.items?.length) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Article Data:", data);
  // }

  return (
    <div className="profile-widget-full" id={WidgetType.article}>
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetType.article).icon}
            </span>
            {WidgetInfoMapping(WidgetType.article).title}
          </h2>
        </div>

        <div className="widget-rss-list noscrollbar">
          <div className="widget-hero">
            <div className="widget-hero-description mb-2">
              {
                data?.sites?.map((site, idx) => {
                  return (
                    <>
                      <Link 
                        key={idx}
                        className="feed-token c-hand" 
                        title={site.description}
                        href={site.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SVG
                          fill={"#fff"}
                          src={SocialPlatformMapping(site.platform).icon || ""}
                          height={24}
                          width={24}
                          className="feed-token-icon"
                          style={{
                            backgroundColor: SocialPlatformMapping(site.platform).color,
                            padding: ".1rem",
                          }}
                        />
                        <span className="feed-token-value">
                          {site.name}
                        </span>
                      </Link>
                    </>
                  );
                })
              }
            </div>
            <div className="widget-hero-description">
              {siteInfo.description || ` ${SocialPlatformMapping(siteInfo.platform).label} by ${profile.identity}`}
            </div>
          </div>
          {data?.items.map((x, idx) => {
            return <ArticleItem data={x} key={idx} openModal={openModal} />;
          })}
        </div>
      </div>
    </div>
  );
}
