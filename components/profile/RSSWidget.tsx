"use client";
import { useCallback } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { RSSFetcher, RSS_END_POINT } from "../apis/rss";
import SVG from "react-inlinesvg";
import Link from "next/link";

function useRSS(domain: string, fromServer: boolean) {
  const { data, error } = useSWR(
    `${RSS_END_POINT}rss?query=${domain}&mode=list`,
    RSSFetcher,
    {
      suspense: true,
      fallbackData: [],
    }
  );
  return {
    data: data || [],
    isLoading: !error && !data,
    isError: error,
  };
}

export default function RSSWidget(props) {
  const { domain, fromServer } = props;
  const { data, isLoading, isError } = useRSS(domain, fromServer);
  const getBoundaryRender = useCallback(() => {
    if (isLoading) return <Loading />;
    if (isError) return <Error />;
    return null;
  }, [isLoading, isError]);

  if (!data || !data?.items?.length) return null;
  console.log(data, "data");
  return (
    <div className="profile-widget-full" id="rss">
      <div className="profile-widget profile-widget-rss">
        <h2 className="profile-widget-title">
          <div className="platform-icon mr-2">
            {data.image && (
              <img
                className="img-responsive"
                src={data.image}
                alt="rss-image"
              />
            )}
          </div>
          {data.title}
          <Link
            className="action-icon"
            href={data.link}
            target={"_blank"}
          >
            <SVG src="icons/icon-open.svg" width={24} height={24} />
          </Link>
        </h2>
        
        <div className="text-assistive">{data.description ?? ""}</div>
        <div className="widgets-rss-list noscrollbar">
          {getBoundaryRender() ||
            data?.items.map((x, idx) => {
              return (
                <Link
                  href={x.link}
                  key={idx}
                  className="rss-item"
                  target={"_blank"}
                >
                  <div className="rss-item-title">
                    {typeof x.title === "string" ? x.title : "Untitled"}
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
