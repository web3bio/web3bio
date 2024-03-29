"use client";
import { useEffect, memo } from "react";
import useSWR from "swr";
import SVG from "react-inlinesvg";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateArticleWidget } from "../../state/widgets/action";
import { FIREFLY_ENDPOINT_DEV, FireflyFetcher } from "../apis/firefly";
import { ModalType } from "../../hooks/useModal";
import { resolveIPFS_URL } from "../../utils/ipfs";

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
  return (
    <div className="profile-widget-full" id="mirror">
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">📰 </span>
            Mirror & Paragraph
          </h2>
          {/* {data.description && (
            <h3 className="text-assistive">{data.description}</h3>
          )} */}
        </div>

        <div className="widget-rss-list noscrollbar">
          <div className="rss-website">
            <div className="rss-website-title mb-1">
              {"Articles of" + profile.displayName}
            </div>

            <Link
              className="btn btn-sm"
              title="More Articles"
              href={""}
              target={"_blank"}
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> More
            </Link>
          </div>
          {data?.map((x, idx) => {
            return (
              <div
                className="rss-item"
                onClick={() => {
                  openModal(ModalType.article, {
                    title: JSON.parse(x.content_body).content.title,
                    content: JSON.parse(x.content_body).content.body,
                    baseURL: "",
                    link: resolveIPFS_URL(x.original_id),
                  });
                }}
                key={idx}
              >
                {JSON.parse(x.content_body).content.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const WidgetArticle = memo(RenderWidgetArticle);
