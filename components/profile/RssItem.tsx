"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RssItem(props) {
  const { data, fromServer } = props;
  const [clientDate, setClientDate] = useState("");
  useEffect(() => {
    if (!fromServer) {
      setClientDate(new Date(data.published).toDateString());
    }
  }, [fromServer, data]);
  return (
    <Link href={data.link} className="rss-item" target={"_blank"}>
      {data.itunes_image && (
        <img
          src={data.itunes_image}
          className="rss-item-img"
          alt={data.title}
        />
      )}
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
