import { memo } from "react";
import { ImageLoader } from "./ImageLoader";
import ImagePlaceholder from "./ImgPlaceholder";

const IsImage = (type) => {
  return [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg",
    "image/gif",
    "image/webp",
    "text/html",
    "model/gltf-binary",
    "model/gltf+json",
    "unknown",
  ].includes(type);
};

const isVideo = (type) => {
  return ["video/mp4", "audio/mpeg", "audio/wav", "video/quicktime"].includes(
    type
  );
};

export interface AssetPlayerProps {
  type?: string;
  className?: string;
  src: string;
  contentUrl?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  alt?: string;
  style?: any;
  poster?: string
}
const RenderNFTAssetPlayer = (props: AssetPlayerProps) => {
  const {
    type = "image/png",
    className,
    src,
    contentUrl,
    width,
    height,
    alt,
    onClick,
    style,
    poster,
  } = props;

  const renderContent = () => {
    if (!src) return <ImagePlaceholder alt={alt} />;
    return IsImage(type) ? (
      <ImageLoader
        width={width}
        height={height}
        src={type === "unknown" ? contentUrl : src}
        alt={alt}
      />
    ) : (
      isVideo(type) && (
        <video
          className="video-responsive"
          width={"100%"}
          height={"100%"}
          muted
          autoPlay
          loop
          playsInline
          poster={poster as string}
        >
          <source src={contentUrl as string} type={type}></source>
        </video>
      )
    );
  };

  return (
    <div onClick={onClick} className={className} style={style}>
      {renderContent()}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
