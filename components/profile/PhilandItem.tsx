"use client";
import Link from "next/link";
import Image from "next/image";
import { isValidURL } from "../../utils/utils";

export default function PhilandItem(props) {
  const { data, onShowDetail } = props;

  return (
    <div
      className="rss-item"
      onClick={() =>
        onShowDetail({
          ...data,
        })
      }
    >
      {data.imageurl && isValidURL(data.imageurl) && (
        <Image
          src={data.imageurl}
          className="rss-item-img"
          alt={data.name}
          height={96}
          width={200}
        />
      )}
      <div className="rss-item-title">{data.name ? data.name : "Untitled"}</div>
    </div>
  );
}
