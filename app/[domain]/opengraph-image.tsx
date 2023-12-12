import { ImageResponse } from "next/og";
import { PlatformType } from "../../utils/platform";
import { handleSearchPlatform } from "../../utils/utils";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { domain: string };
}) {
  const platform = params.domain.includes(".farcaster")
    ? PlatformType.farcaster
    : handleSearchPlatform(params.domain);
  const profile = await fetch(
    process.env.NEXT_PUBLIC_PROFILE_END_POINT +
      `/ns/${platform.toLowerCase()}/${params.domain.replace(".farcaster", "")}`
  ).then((res) => res.json());

  if (!profile || profile?.error)
    return new ImageResponse(
      <img src={"https://web3.bio/img/web3bio-social.jpg"} alt="" />,
      {
        ...size,
      }
    );

  const qrcodeUrl = `https://kissapi-qrcode.vercel.app/api/qrcode?chl=https://web3.bio/${params.domain}`;

  return new ImageResponse(
    (
      <div
        style={{
          color: "#000",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          letterSpacing: "-.05em",
          padding: "4rem 5rem",
          height: 630,
          width: 1200,
          gap: "1rem",
          position: "relative",
        }}
      >
        <img
          style={{
            boxShadow:
              "inset 0 0 0 .2rem rgba(255,255,255,.1), 0 .4rem 1rem rgba(0, 0, 0, .1)",
            borderRadius: "50%",
          }}
          width={120}
          height={120}
          src={profile.avatar}
          alt=""
        />

        <div
          style={{
            fontFamily: "initial",
            fontSize: "4rem",
            fontWeight: 700,
            letterSpacing: "-.05em",
          }}
        >
          {profile?.displayName}
        </div>
        <div
          style={{
            borderRadius: "4rem",
            display: "flex",
            flex: 1,
            fontSize: "1.5rem",
            paddingLeft: ".25rem",
          }}
        >
          web3.bio/{params.domain}
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "1.4rem",
              color: "rgba(0,0,0,.4)",
            }}
          >
            {profile?.address}
          </div>

          <img
            style={{
              borderRadius: "1rem",
            }}
            width={180}
            height={180}
            src={qrcodeUrl}
            alt=""
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
