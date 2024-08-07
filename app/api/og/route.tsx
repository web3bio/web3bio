import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatText } from "../../../components/utils/utils";
import qrcode from "yaqrcode";
import { profileAPIBaseURL } from "../../../components/utils/queries";

export const runtime = "edge";
// export const preferredRegion = ["sfo1", "hnd1"];

const SIZE = {
  width: 1200,
  height: 630,
};

const FONTS = {
  bold: new URL("./fonts/Geist-Black.otf", import.meta.url),
  normal: new URL("./fonts/Geist-Regular.otf", import.meta.url),
};

async function loadFonts() {
  const [boldFont, normalFont] = await Promise.all([
    fetch(FONTS.bold).then((res) => res.arrayBuffer()),
    fetch(FONTS.normal).then((res) => res.arrayBuffer()),
  ]);
  return { boldFont, normalFont };
}

function getAvatarUrl(avatar: string | null, path: string) {
  if (avatar?.includes(".webp")) {
    return `${profileAPIBaseURL}/avatar/process?url=${encodeURIComponent(
      avatar
    )}`;
  }
  return avatar || `${profileAPIBaseURL}/avatar/svg?handle=${path}`;
}
function generateQRCode(path: string) {
  return qrcode(`https://web3.bio/${path}`, { size: 100 });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const path = searchParams.get("path") || "";
    const url = `web3.bio/${path}`;
    const address = searchParams.get("address");
    const displayName = searchParams.get("displayName");
    const description = searchParams.get("description");
    const avatar = searchParams.get("avatar");

    if (![address, path, displayName].some(Boolean)) {
      throw new Error("Missing required parameters");
    }

    const avatarImg = getAvatarUrl(avatar, path);
    const { boldFont, normalFont } = await loadFonts();

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
        ...SIZE,
        headers: {
          "Content-Disposition": `filename=${path}.png`,
        },
        fonts: [
          {
            name: "geist",
            data: boldFont,
            style: "normal",
            weight: 700,
          },
          {
            name: "geist",
            data: normalFont,
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
          width={SIZE.width}
          height={SIZE.height}
          src={"https://web3.bio/img/web3bio-social.jpg"}
          alt="social"
        />
      ),
      {
        ...SIZE,
      }
    );
  }
}
