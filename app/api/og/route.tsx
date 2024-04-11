import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatText } from "../../../utils/utils";
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
    const paramAvatar = searchParams.get("avatar");
    const avatarImg =
      !paramAvatar || paramAvatar === "null"
        ? process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/avatar/${path}`
        : paramAvatar;

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
<<<<<<< HEAD
              backgroundImage: avatarImg
                ? `url(${avatarImg})`
                : "radial-gradient(at 40% 33%, #FBF4EC 0px, rgba(251,244,236,0) 50%), radial-gradient(at 82% 10%, #ECD7C8 0px, rgba(236,215,200,0) 50%), radial-gradient(at 17% -11%, #EEA4BC 0px, rgba(238,164,188,0) 30%), radial-gradient(at 48% 2%, #BE88C4 0px, rgba(190,136,196,0) 50%), radial-gradient(at 39% 67%, #ECD7C8 0px, rgba(236,215,200,0) 50%), radial-gradient(at 96% 158%, #92C9F9 0px, rgba(146,201,249,0) 50%), radial-gradient(at 61% 57%, #C7F8FF 0px, rgba(199,248,255,0) 50%)",
=======
              backgroundImage: `url(${avatarImg}), url(${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/avatar/${path})`,
>>>>>>> d788e484d6dc6e326c2791c8d29a7c9bf6aa6794
              backgroundPosition: "0 top",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 200px",
              color: "transparent",
<<<<<<< HEAD
              opacity: 0.2,
=======
              opacity: 0.25,
>>>>>>> d788e484d6dc6e326c2791c8d29a7c9bf6aa6794
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
              width={100}
              height={100}
              src={avatarImg}
              alt=""
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
<<<<<<< HEAD
                width={120}
                height={120}
                src={qrcode(`https://web3.bio/${path}`, {
                  size: 120,
                })}
                alt={`https://web3.bio/${path}`}
=======
                width={100}
                height={100}
                src={qrcode(`https://web3.bio/${path}`, {
                  size: 100,
                })}
                alt={""}
>>>>>>> d788e484d6dc6e326c2791c8d29a7c9bf6aa6794
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
        />
      ),
      {
        ...size,
      }
    );
  }
}
