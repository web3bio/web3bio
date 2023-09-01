"use client";
import { useCallback } from "react";
import useSWR from "swr";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import { RSSFetcher, RSS_END_POINT } from "../apis/rss";
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
        <Link
          href={data.link}
          className="profile-widget-title"
          target={"_blank"}
        >
          <div className="platform-icon mr-2">
            <img
              className="img-responsive"
              src={data.image ?? ""}
              alt="rss-image"
            />
          </div>
          {data.title}
        </Link>
        <div className="text-assistive">{data.description ?? ""}</div>
        <div className="widgets-rss-list">
          {getBoundaryRender() ||
            data?.items.map((x, idx) => {
              return (
                <Link
                  href={x.link}
                  key={idx}
                  className="rss-item"
                  target={"_blank"}
                >
                  {new Date(x.published).toDateString()}
                  <div className="rss-item-title">
                    {typeof x.title === "string" ? x.title : "Empty Title"}
                  </div>
                  <div className="rss-item-content">
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
