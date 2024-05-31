import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  try {
    const url = new URL(searchParams.get("url")!);
    
    const imageBuffer = await fetch(url!).then((res) => res.arrayBuffer());
    const resultBuffer = await sharp(imageBuffer)
      .jpeg({
        quality: 92,
      })
      .resize(480)
      .toBuffer();

    return new Response(resultBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control":
          "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return NextResponse.json("Invalid Image URL");
  }
}