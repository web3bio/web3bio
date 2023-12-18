import { ImageResponse } from "next/og";
export const runtime = "edge";
const size = {
  width: 1200,
  height: 630,
};
export async function GET() {
  return new ImageResponse(
    <img src={"https://web3.bio/img/web3bio-social.jpg"} alt="" />,
    {
      ...size,
    }
  );
}
