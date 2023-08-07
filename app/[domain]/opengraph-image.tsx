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
    `/profile/${platform.toLowerCase()}/${domain.replaceAll(".farcaster", "")}`;
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
          <div
            style={{
              background: "url('https://web3.bio/logo-web3bio.png')",
              backgroundSize: "100% 100%",
              borderRadius: "50%",
              width: 200,
              height: 200,
              boxShadow: "2px 2px 48px 2px rgba(0, 0, 0, 0.2)",
              display: "flex",
            }}
          >
            <img
              width={"202px"}
              height={"202px"}
              src={data.avatar || "https://web3.bio/logo-web3bio.png"}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
              }}
              alt={domain}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div>{data.displayName ?? domain}</div>
            <div>{data.identity ?? domain}</div>
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
