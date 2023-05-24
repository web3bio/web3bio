import { memo } from "react";
import { ImageLoader } from "./ImageLoader";
import ImagePlaceholder from "./ImgPlaceholder";

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
  width?: number;
  height?: number;
  onClick?: () => void;
  alt?: string;
  style?: React.CSSProperties;
  poster?: string;
}

function renderImage(props: AssetPlayerProps) {
  const { width, height, src, alt } = props;
  return <ImageLoader width={width} height={height} src={src} alt={alt} />;
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
    return <ImagePlaceholder alt={props.alt} />;
  }

  return (
    <div onClick={onClick} className={className} style={style}>
      {renderContent()}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
