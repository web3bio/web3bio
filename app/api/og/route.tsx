import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatText } from "../../../components/utils/utils";
import qrcode from "yaqrcode";

export const runtime = "edge";

let filename = "og.png";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const path = searchParams.get("path");
    filename = path + ".png";
    const url = `web3.bio/${path}`;
    const address = searchParams.get("address");
    const displayName = searchParams.get("displayName");
    const description = searchParams.get("description");
    const avatarImg =
      process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/avatar/${path}`;
    const isShowDefault = ![address, path, displayName].some((x) => !!x);

    if (isShowDefault) {
      throw new Error("Params is missing");
    }

    const fontBold = await fetch(
      new URL("./fonts/Geist-Black.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const fontNormal = await fetch(
      new URL("./fonts/Geist-Regular.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            color: "#000",
            backgroundColor: "#fff",
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
              backgroundImage: `url(${avatarImg})`,
              // backgroundImage: `url(${avatarImg}), url(${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/avatar/svg?handle=${path})`,
              backgroundPosition: "0 top",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 200px",
              color: "transparent",
              opacity: 0.25,
              width: 1200,
              height: 200,
              position: "absolute",
              filter: "blur(8em)",
              left: 0,
              top: 0,
            }}
          ></div>

          {avatarImg && (
            <img
              style={{
                backgroundColor: "transparent",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              width={120}
              height={120}
              src={avatarImg}
              alt="avatar"
            />
          )}

          <div
            style={{
              fontSize: "80px",
              letterSpacing: "-.05em",
              marginTop: "60px",
              fontWeight: "bold",
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "30px",
              flex: 1,
              height: "120px",
              lineHeight: 1.65,
              width: "800px",
            }}
          >
            {description ? formatText(description, 160) : formatText(address)}
          </div>

          {path && (
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
                  fontSize: "30px",
                  color: "rgba(0, 0, 0, .5)",
                }}
              >
                {url}
              </div>

              <img
                style={{
                  background: "transparent",
                }}
                width={100}
                height={100}
                src={qrcode(`https://web3.bio/${path}`, {
                  size: 100,
                })}
                alt={"qrcode"}
              />
            </div>
          )}
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
            style: "normal",
            weight: 700,
          },
          {
            name: "geist",
            data: fontNormal,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );
  } catch (e) {
    return new ImageResponse(
      (
        <img
          width={size.width}
          height={size.height}
          src={"https://web3.bio/img/web3bio-social.jpg"}
          alt="social"
        />
      ),
      {
        ...size,
      }
    );
  }
}
