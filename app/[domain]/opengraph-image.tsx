/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
import { handleSearchPlatform } from "../../utils/utils";

// Route segment config
export const runtime = "edge";
// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

const fetchProfile = async (domain: string) => {
  const platform = handleSearchPlatform(domain);
  const url =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT +
    `/profile/${platform.toLowerCase()}/${domain.replaceAll('.farcaster','')}`;
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
  const data = await fetchProfile(domain);
  const getImgContent = async () => {
    let avatarURL = "" as any;
    try {
      avatarURL = await fetch(data.avatar).then((res) => res.arrayBuffer());
    } catch (e) {
      console.log("error", e);
      avatarURL = "https://web3.bio/logo-web3bio.png";
    }
    return avatarURL;
  };
  const avatarURI = await getImgContent();
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-.02em",
          background: "#fff",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            left: 42,
            top: 42,
            position: "absolute",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            width={24}
            height={24}
            src="https://web3.bio/logo-web3bio.png"
            alt=""
          />
          <span
            style={{
              marginLeft: 8,
              fontSize: 20,
            }}
          >
            Web3.bio
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 80,
            padding: "20px 50px",
            margin: "0 42px",
            fontSize: 48,
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          <img
            width={"200px"}
            height={"200px"}
            src={avatarURI}
            style={{
              borderRadius: "50%",
              boxShadow: "inset 0 0 6px 6px rgba(255, 255, 255, .1)",
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
                gap: "12px",
              }}
            >
              {Object.keys(data?.links || {}).map((x) => {
                return (
                  <img
                    style={{
                      color: "#fff",
                    }}
                    key={x}
                    width={36}
                    height={36}
                    src={`https://web3.bio/${
                      SocialPlatformMapping(x as PlatformType).icon
                    }`}
                    alt="platform"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
