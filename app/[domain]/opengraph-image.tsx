import { ImageResponse } from "next/server";
import { handleSearchPlatform } from "../../utils/utils";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 480,
  height: 240,
};

const fetchAvatar = async (domain: string) => {
  const platform = handleSearchPlatform(domain);
  const url =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT +
    `/profile/${platform.toLowerCase()}/${domain}`;
  return await fetch(url).then((res) => res.json());
};

export const contentType = "image/png";

// Image generation
export default async function Image({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = params;
  const data = await fetchAvatar(domain);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {data.avatar ? (
          <div
            style={{
              fontSize: 20,
              backgroundImage:
                "linear-gradient(45deg, #FBF4EC 5%, #ECD7C8 50%, #BE88C4 95%)",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <img
              className="avatar"
              width={"128px"}
              height={"128px"}
              src={data?.avatar || ""}
              style={{
                borderRadius: "50%",
              }}
              alt={domain}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div>{data.displayName}</div>
              <div>{data.description}</div>
            </div>
          </div>
        ) : (
          <img src="https://web3.bio/img/web3bio-social.jpg" alt={domain} />
        )}
      </div>
    ),
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
