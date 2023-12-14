import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatText } from "../../utils/utils";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const avatarImg =
      !searchParams.get("avatar") || searchParams.get("avatar") === "null"
        ? ""
        : searchParams.get("avatar");
    const identity = searchParams.get("identity");
    const displayName = searchParams.get("displayName");

    const interBold = await fetch(
      new URL("./fonts/Inter-SemiBold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const interNormal = await fetch(
      new URL("./fonts/Inter-Medium.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const qrcodeUrl = `https://kissapi-qrcode.vercel.app/api/qrcode?chs=180x180&chl=https://web3.bio/${identity}`;

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
            fontFamily: "inter-normal",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundImage: avatarImg ? `url(${avatarImg})` : "",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#fff",
              backgroundSize: "80% 30%",
              opacity: 0.15,
              width: 1200,
              height: 630,
              position: "absolute",
              filter: "blur(8em)",
              left: 0,
              top: 0,
              color: "transparent",
            }}
          >
            invisible
          </div>
          {avatarImg && (
            <img
              style={{
                boxShadow:
                  "inset 0 0 0 0.2rem rgba(255, 255, 255, 0.1), 0 0.4rem 1rem rgba(0, 0, 0, 0.1)",
                borderRadius: "50%",
              }}
              width={120}
              height={120}
              src={avatarImg || ""}
              alt=""
            />
          )}

          <div
            style={{
              fontFamily: "inter-bold",
              fontSize: "4rem",
              letterSpacing: "-.05em",
            }}
          >
            {displayName}
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
            web3.bio/{identity}
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
              {formatText(address, 42)}
            </div>

            <img
              style={{
                borderRadius: "1rem",
                transform: "translateY(20%)",
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
        fonts: [
          {
            name: "inter-bold",
            data: interBold,
            style: "normal",
          },
          {
            name: "inter-normal",
            data: interNormal,
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
