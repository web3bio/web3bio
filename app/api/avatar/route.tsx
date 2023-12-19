import Avatar, { AvatarProps } from "boring-avatars";
import { ImageResponse } from "next/og";
import { createElement } from "react";
import * as uuid from "uuid";

const { renderToStaticMarkup, renderToString } = require("react-dom/server");

export const runtime = "edge";

const sizes = {
  width: 80,
  height: 80,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const el = createElement(Avatar, {
    name: Buffer.from(uuid.v4()).toString("base64"),
    size: 80,
    variant:
      (searchParams.get("variant") as AvatarProps["variant"]) || "marble",
  });

  const html = renderToString(el);
  console.log(html, "html");
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
        }}
      >
        {html}
      </div>
    ),
    {
      ...sizes,
      headers: {
        "Cache-Control": "s-maxage=31536000, stale-while-revalidate",
        "Content-Type": "image/svg+xml",
      },
    }
  );
}
