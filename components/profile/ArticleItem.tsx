"use client";
import Image from "next/image";
import SVG from "react-inlinesvg";
import { SocialPlatformMapping } from "../utils/platform";

export default function ArticleItem(props) {
  const { data, openModal } = props;
  const handleClick = () => {
    openModal({
      title: data.title,
      link: data.link,
      content: data.body,
      description: data.description,
      platform: data.platform,
      baseURL: data.baseURL,
      published: data.published
    });
  };

  return (
    <div className="rss-item" onClick={handleClick}>
      {data.thumbnail && (
        <Image
          src={data.thumbnail}
          className="rss-item-img"
          alt={data.title}
          height={96}
          width={200}
        />
      )}
      <div className="rss-item-tag">
        <span className="label text-dark">
          <SVG
            fill={"#121212"}
            src={SocialPlatformMapping(data.platform)?.icon || ""}
            height={18}
            width={18}
            className="mr-1"
          />
          {SocialPlatformMapping(data.platform)?.label}
        </span>
      </div>
      <div className="rss-item-title">
        {data.title || "Untitled"}
      </div>
      <time
        dateTime={data.published}
        suppressHydrationWarning
        className="rss-item-date"
      >
        {new Date(data.published).toLocaleDateString()}
      </time>

      <div className="rss-item-content text-assistive">
        {typeof data.description === "string" ? data.description : ""}
      </div>
    </div>
  );
}
