import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatText } from "../../../utils/utils";

export const runtime = "edge";

const isValidURL = (v) => {
  try {
    const url = new URL(v);
    return !!url;
  } catch (e) {
    return false;
  }
};

let filename = "og.png";

const size = {
  width: 1200,
  height: 630,
};
export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const identity = params.domain;
    filename = params.domain + ".png";
    const paramAddress = searchParams.get("address");
    const paramAvatar = searchParams.get("avatar");
    const paramDisplayName = searchParams.get("displayName");
    const address =
      !paramAddress || paramAddress === "null" ? "" : paramAddress;
    const avatarImg =
      !paramAvatar || paramAvatar === "null" || !isValidURL(paramAvatar)
        ? ""
        : paramAvatar;
    const displayName =
      !paramDisplayName || paramDisplayName === "null" ? "" : paramDisplayName;
    const isShowDefault = ![address, avatarImg, identity, displayName].some(
      (x) => !!x
    );
    if (isShowDefault)
      return new ImageResponse(
        <img src={"https://web3.bio/img/web3bio-social.jpg"} alt="" />,
        {
          ...size,
        }
      );
    const fontBold = await fetch(
      new URL("./fonts/Geist-Black.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const fontNormal = await fetch(
      new URL("./fonts/Geist-Regular.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const qrcodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=180x180&chl=https://web3.bio/${identity}`;

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
            fontFamily: "font-normal",
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
              opacity: 0.25,
              width: 1200,
              height: 630,
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
                boxShadow:
                  "inset 0 0 0 0.2rem rgba(255, 255, 255, 0.1), 0 0.4rem 1rem rgba(0, 0, 0, 0.1)",
                borderRadius: "50%",
              }}
              width={180}
              height={180}
              src={avatarImg || ""}
              alt=""
            />
          )}

          <div
            style={{
              fontFamily: "font-bold",
              fontSize: "5rem",
              letterSpacing: "-.05em",
              marginTop: "20px",
            }}
          >
            {displayName}
          </div>

          {identity && (
            <div
              style={{
                borderRadius: "4rem",
                display: "flex",
                flex: 1,
                fontSize: "2rem",
                paddingLeft: ".25rem",
              }}
            >
              web3.bio/{identity}
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

            {identity && (
              <img
                style={{
                  background: "transparent",
                  transform: "translateY(20%)",
                }}
                width={140}
                height={140}
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
            name: "font-bold",
            data: fontBold,
            style: "normal",
          },
          {
            name: "font-normal",
            data: fontNormal,
            style: "normal",
          },
        ],
      }
    );
  } catch (e) {
    return new ImageResponse(
      <img src={"https://web3.bio/img/web3bio-social.jpg"} alt="" />,
      {
        ...size,
      }
    );
  }
}
