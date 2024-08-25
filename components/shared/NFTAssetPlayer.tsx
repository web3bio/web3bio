import { memo, useState } from "react";
import ImagePlaceholder from "./ImgPlaceholder";
import Image from "next/image";

export enum MediaType {
  PNG = "image/png",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  SVG = "image/svg",
  GIF = "image/gif",
  WEBP = "image/webp",
  HEIC = "image/heic",
  HTML = "text/html",
  GLTF_BINARY = "model/gltf-binary",
  GLTF_JSON = "model/gltf+json",
  UNKNOWN = "unknown",
}

export enum VideoType {
  MP4 = "video/mp4",
  QUICKTIME = "video/quicktime",
  MPEG = "audio/mpeg",
  WAV = "audio/wav",
}

export function isImage(type: string) {
  return Object.values(MediaType).includes(type as MediaType);
}

export function isVideo(type: string) {
  return Object.values(VideoType).includes(type as VideoType);
}

export interface AssetPlayerProps {
  type?: string;
  className?: string;
  src: string;
  width?: number | string;
  height?: number | string;
  onClick?: (e?) => void;
  alt: string;
  placeholder?: boolean;
  style?: React.CSSProperties;
  poster?: string;
}

function ImageRender(props: AssetPlayerProps) {
  const { width, height, placeholder, src, alt } = props;
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      width={typeof width === "number" ? width : 0}
      height={typeof height === "number" ? height : 0}
      className={`img-responsive${(placeholder && !loaded) ? " img-loading" : ""}`}
      style={{
        width: width ? width : "100%",
        height: height ? height : "auto",
      }}
      src={src}
      alt={alt}
      loading={"lazy"}
      onLoad={()=>setLoaded(true)}
    />
  );
}

function VideoRender(props: AssetPlayerProps) {
  const { src, type, poster } = props;
  const videoType = type?.replaceAll(VideoType.QUICKTIME, VideoType.MP4);
  const [isError, setIsError] = useState(false);
  return isError ? (
    <div className="video-responsive empty">
      <div>This video is currently not available</div>
      <small>{src}</small>
    </div>
  ) : (
    <video
      className="video-responsive"
      width={"100%"}
      height={"100%"}
      onError={() => setIsError(true)}
      muted
      autoPlay
      controls
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
    if (isImage(type)) return <ImageRender {...props} />;
    if (isVideo(type)) return <VideoRender {...props} />;
    return (
      <ImagePlaceholder
        alt={props.alt}
        style={{
          width: props.width ? props.width : "100%",
          height: props.height ? props.height : "auto",
        }}
      />
    );
  }

  return (
    <div onClick={onClick} className={className} style={style}>
      {renderContent()}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
