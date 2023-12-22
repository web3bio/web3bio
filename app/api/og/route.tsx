import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatText } from "../../../utils/utils";

export const runtime = "edge";

let filename = "og.png";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } = request.nextUrl;
    const path = searchParams.get("path");
    filename = path + ".png";
    const address = searchParams.get("address");
    const displayName = searchParams.get("displayName");
    const paramAvatar = searchParams.get("avatar");
    const avatarImg =
      !paramAvatar || paramAvatar === "null"
        ? process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/avatar/${path}`
        : paramAvatar;
    
    const isShowDefault = ![address, path, displayName].some(
      (x) => !!x
    );

    if (isShowDefault) {
      throw new Error("Params is missing");
    }

    const fontBold = await fetch(
      new URL("./fonts/Geist-Black.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const fontNormal = await fetch(
      new URL("./fonts/Geist-Regular.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const qrcodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=120x120&chld=L|0&chl=https://web3.bio/${path}`;

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
            fontFamily: "geist",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#fff",
              backgroundImage: avatarImg ? `url(${avatarImg})` : "",
              backgroundPosition: "0 top",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 240px",
              opacity: 0.1,
              width: 1200,
              height: 240,
              position: "absolute",
              filter: "blur(8em)",
              left: 0,
              top: 0,
              color: "transparent",
            }}
          ></div>

          {avatarImg && (
            <img
              style={{
                backgroundColor: "#efefef",
                boxShadow:
                  "inset 0 0 0 0.2rem rgba(255, 255, 255, 0.1), 0 0.4rem 1rem rgba(0, 0, 0, 0.1)",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              width={180}
              height={180}
              src={avatarImg}
              alt=""
            />
          )}

          <div
            style={{
              fontSize: "5rem",
              letterSpacing: "-.05em",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            {displayName}
          </div>

          {path && (
            <div
              style={{
                borderRadius: "4rem",
                display: "flex",
                flex: 1,
                fontSize: "2rem",
                paddingLeft: ".25rem",
              }}
            >
              web3.bio/{path}
            </div>
          )}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            {address && (
              <div
                style={{
                  fontSize: "2rem",
                  color: "rgba(0,0,0,.4)",
                }}
              >
                {formatText(address, 42)}
              </div>
            )}

            {path && (
              <img
                style={{
                  background: "transparent",
                }}
                width={120}
                height={120}
                src={qrcodeUrl}
                alt=""
              />
            )}
          </div>
        </div>
      ),
      {
        ...size,
        headers: {
          "Content-Disposition": "filename=" + filename,
        },
        fonts: [
          {
            name: "geist",
            data: fontBold,
            style: 'normal',
            weight: 700,
          },
          {
            name: "geist",
            data: fontNormal,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (e) {
    return new ImageResponse(
      <img width={size.width} height={size.height} src={"https://web3.bio/img/web3bio-social.jpg"} />,
      {
        ...size,
      }
    );
  }
}