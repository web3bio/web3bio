"use client";
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { RSSFetcher, RSS_ENDPOINT } from "../apis/rss";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { handleSearchPlatform } from "../../utils/utils";
import { PlatformType } from "../../utils/platform";

function getQueryDomain(
  domain: string,
  relations: Array<{ platform: PlatformType; identity: string }>
) {
  const pureDomain = domain.endsWith(".farcaster")
    ? domain.replace(".farcaster", "")
    : domain;
  const platform = handleSearchPlatform(pureDomain);
  if ([PlatformType.ens, PlatformType.dotbit].includes(platform))
    return pureDomain;
  return (
    relations.find((x) => x.platform === PlatformType.ens)?.identity ||
    relations.find((x) => x.platform === PlatformType.dotbit)?.identity
  );
}

function useRSS(domain: string, relations) {
  const queryDomain = getQueryDomain(domain, relations);
  const { data, error, isValidating } = useSWR(
    queryDomain ? `${RSS_ENDPOINT}rss?query=${queryDomain}&mode=list` : null,
    RSSFetcher,
    {
      suspense: true,
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );
  return {
    data: data || [],
    isLoading: isValidating,
    isError: error,
  };
}

export default function WidgetRss(props) {
  const { domain, setEmpty, relations } = props;
  const { data, isLoading, isError } = useRSS(domain, relations);
  const getBoundaryRender = useCallback(() => {
    if (isLoading) return <Loading />;
    if (isError) return <Error />;
    return null;
  }, [isLoading, isError]);

  useEffect(() => {
    if (!isLoading && data && !data?.items?.length) {
      setEmpty(true);
    }
  }, [data, isLoading, setEmpty]);
  if (!data || !data?.items?.length) return null;
  return (
    <div className="profile-widget-full" id="rss">
      <div className="profile-widget profile-widget-rss">
        <h2 className="profile-widget-title">
          {data.image ? (
            <div className="platform-icon mr-2">
              <img
                className="img-responsive"
                src={data.image}
                alt="rss-image"
              />
            </div>
          ) : (
            <span className="emoji-large mr-2">📰</span>
          )}
          {data.title}
          <Link
            className="action-icon btn btn-sm"
            href={data.link}
            target={"_blank"}
          >
            <span className="action-icon-label">More</span>
            <SVG src="icons/icon-open.svg" width={20} height={20} />
          </Link>
        </h2>
        {data.description && (
          <h3 className="text-assistive">{data.description}</h3>
        )}

        <div className="widget-rss-list noscrollbar">
          {getBoundaryRender() ||
            data?.items.map((x, idx) => {
              return (
                <Link
                  href={x.link}
                  key={idx}
                  className="rss-item"
                  target={"_blank"}
                >
                  {x.itunes_image && (
                    <img
                      src={x.itunes_image}
                      className="rss-item-img"
                      alt={x.title}
                    />
                  )}
                  <div className="rss-item-title">
                    {x.title ? x.title : "Untitled"}
                  </div>
                  <div className="rss-item-date">
                    {new Date(x.published).toDateString()}
                  </div>
                  <div className="rss-item-content text-assistive">
                    {typeof x.description === "string" ? x.description : ""}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
