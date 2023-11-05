import { memo } from "react";
import ImagePlaceholder from "./ImgPlaceholder";
import Image from "next/image";

export enum MediaType {
  PNG = "image/png",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  SVG = "image/svg",
  GIF = "image/gif",
  WEBP = "image/webp",
  HTML = "text/html",
  GLTF_BINARY = "model/gltf-binary",
  GLTF_JSON = "model/gltf+json",
  UNKNOWN = "unknown",
}

export enum VideoType {
  MP4 = "video/mp4",
  MPEG = "audio/mpeg",
  WAV = "audio/wav",
  QUICKTIME = "video/quicktime",
}

const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="rgba(255,255,255,0)" offset="20%" />
        <stop stop-color="rgba(255,255,255,.25)" offset="50%" />
        <stop stop-color="rgba(255,255,255,0)" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="rgba(233,233,233,.5)" rx="10" ry="10"/>
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.25s" repeatCount="indefinite"  />
  </svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

function isImage(type: string) {
  return Object.values(MediaType).includes(type as MediaType);
}

function isVideo(type: string) {
  return Object.values(VideoType).includes(type as VideoType);
}

export interface AssetPlayerProps {
  type?: string;
  className?: string;
  src: string;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  alt: string;
  style?: React.CSSProperties;
  poster?: string;
}

function renderImage(props: AssetPlayerProps) {
  const { width, height, src, alt } = props;
  return (
    <Image
      width={typeof width === "number" ? width : 0}
      height={typeof height === "number" ? height : 0}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(100, 100))}`}
      className="img-responsive"
      style={{ width: width ? width : "100%", height: height ? height : "auto" }}
      src={src}
      alt={alt}
      loading={"lazy"}
    />
  );
}

function renderVideo(props: AssetPlayerProps) {
  const { src, type, poster } = props;
  const videoType = type?.replaceAll(VideoType.QUICKTIME, VideoType.MP4);

  return (
    <video
      className="video-responsive"
      width={"100%"}
      height={"100%"}
      muted
      autoPlay
      loop
      playsInline
      poster={poster}
    >
      <source src={src} type={videoType}></source>
    </video>
  );
}

const RenderNFTAssetPlayer = (props: AssetPlayerProps) => {
  const { type = MediaType.PNG, className, onClick, style } = props;

  function renderContent() {
    if (!props.src) return <ImagePlaceholder alt={props.alt} />;
    if (isImage(type)) return renderImage(props);
    if (isVideo(type)) return renderVideo(props);
    return <ImagePlaceholder alt={props.alt} style={{ width: props.width ? props.width : "100%", height: props.height ? props.height : "auto" }} />;
  }

  return (
    <div onClick={onClick} className={className} style={style}>
      {renderContent()}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
