"use client";
import { useEffect, memo } from "react";
import useSWR from "swr";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateArticleWidget } from "../../state/widgets/action";
import { FIREFLY_ENDPOINT_DEV, FireflyFetcher } from "../apis/firefly";
import { ModalType } from "../../hooks/useModal";
import { domainRegexp } from "../feed/ActionExternalMenu";

const MirrorBaseURL = "https://mirror.xyz/";
const ParagraphBaseURL = "https://paragraph.xyz/";

function useArticles(address: string) {
  // platform mirror(1) paragraph(2)
  const { data, error, isValidating } = useSWR(
    [
      FIREFLY_ENDPOINT_DEV + "/article/v1/article",
      {
        addresses: [address],
        limit: 20,
      },
    ],
    FireflyFetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );
  return {
    data: data?.data || [],
    isLoading: isValidating,
    isError: error,
  };
}

const RenderWidgetArticle = ({ profile, openModal }) => {
  const { data, isLoading } = useArticles(profile.address);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        updateArticleWidget({
          isEmpty: !data?.data?.length,
          initLoading: false,
        })
      );
    }
  }, [data, isLoading, dispatch]);
  if (!data?.length) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Article Data:", data);
  // }
  const ParagraphURLItem = (() => {
    try {
      return JSON.parse(data?.find((x) => x.platform === 2)?.content_body || "")
        .url;
    } catch {
      return null;
    }
  })();
  return (
    <div className="profile-widget-full" id="mirror">
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">📰 </span>
            Mirror & Paragraph
          </h2>

          <div className="btn-group widget-action">
            <Link
              className="btn btn-sm"
              title="More Articles"
              href={MirrorBaseURL + profile.identity}
              target={"_blank"}
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> Mirror
            </Link>
            <Link
              className="btn btn-sm"
              title="More Articles"
              href={
                ParagraphURLItem
                  ? `https://${domainRegexp.exec(ParagraphURLItem)?.[1]}`
                  : ParagraphBaseURL + `@${profile.identity}`
              }
              target={"_blank"}
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> Paragraph
            </Link>
          </div>
        </div>

        <div className="widget-rss-list noscrollbar">
          <div className="rss-website">
            <div className="rss-website-title mb-1">
              {"Articles of " + profile.displayName}
            </div>
          </div>
          {data?.map((x, idx) => {
            const content = JSON.parse(x.content_body);
            console.log(content);
            return (
              <div
                className="rss-item"
                onClick={() => {
                  openModal(ModalType.article, {
                    title:
                      x.platform === 1 ? content.content.title : content.title,
                    content:
                      x.platform === 1
                        ? content.content.body
                        : content.markdown,
                    link:
                      x.platform === 1
                        ? `${MirrorBaseURL}/${profile.identity}/${x.original_id}`
                        : content.url
                        ? `https://${content.url}`
                        : `${ParagraphBaseURL}/@${profile.identity}/${content.slug}`,
                  });
                }}
                key={idx}
              >
                <div className="rss-item-title">{x.content_title}</div>
                <time
                  dateTime={x.content_timestamp * 1000 + ""}
                  suppressHydrationWarning
                  className="rss-item-date"
                >
                  {new Date(x.content_timestamp * 1000).toDateString()}
                </time>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const WidgetArticle = memo(RenderWidgetArticle);
