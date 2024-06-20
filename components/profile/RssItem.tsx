"use client";
import Link from "next/link";
import Image from "next/image";
import SVG from "react-inlinesvg";
import { SocialPlatformMapping } from "../utils/platform";

export default function RssItem(props) {
  const { data } = props;

  return (
    <Link href={data.link} className="rss-item" target={"_blank"}>
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
            src={SocialPlatformMapping(data.platform).icon || ""}
            height={18}
            width={18}
            className="mr-1"
          />
          {SocialPlatformMapping(data.platform)?.label}
        </span>
      </div>
      <div className="rss-item-title">
        {data.title ? data.title : "Untitled"}
      </div>
      <time
        dateTime={data.published}
        suppressHydrationWarning
        className="rss-item-date"
      >
        {new Date(data.published).toDateString()}
      </time>

      <div className="rss-item-content text-assistive">
        {typeof data.description === "string" ? data.description : ""}
      </div>
    </Link>
  );
}
