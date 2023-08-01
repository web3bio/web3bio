import { ImageResponse } from "next/server";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
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

const host = "https://web3.bio/";

export const contentType = "image/png";

// Image generation
export default async function Image({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = params;
  const data = await fetchAvatar(domain);
  console.log(data, "data");
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
              backgroundColor: "#fff",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "16px 24px",
              gap: 48,
            }}
          >
            <img
              width={"180px"}
              height={"180px"}
              src={data?.avatar || ""}
              style={{
                borderRadius: "50%",
                boxShadow: "inset 0 6px 12px rgba(0, 0, 0, .1)",
              }}
              alt={domain}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>{data.displayName}</div>
              <div>{data.identity}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {Object.keys(data?.links).map((x) => {
                  return (
                    <img
                      key={x}
                      width={20}
                      height={20}
                      src={host + SocialPlatformMapping(x as PlatformType).icon}
                      alt=""
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <img src="https://web3.bio/img/web3bio-social.jpg" alt={domain} />
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
