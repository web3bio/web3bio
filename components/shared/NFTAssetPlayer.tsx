import { memo } from "react";
import { ImageLoader } from "./ImageLoader";

const IsImage = (type) => {
  return ["image/png", "image/jpeg", "image/jpg", "image/svg", "image/gif", "image/webp", "text/html"].includes(type);
};

const isVideo = (type) => {
  return ["video/mp4", "audio/mpeg", "audio/wav"].includes(type);
};

const isAudio = (type) => {
  return ["video/mp4", "audio/mpeg", "audio/wav"].includes(type);
};

const RenderNFTAssetPlayer = (props) => {
  const { type = "image/png", className, src, contentUrl, width, height, alt } = props;
  return (
    <div className={className}>
      {
        src ? 
          IsImage(type) ? (
            <ImageLoader
              width={width}
              height={height}
              src={src}
              alt={alt}
              loading="lazy"
            />
          ) : isVideo(type) ? (
            <video
              style={{ borderRadius: 8 }}
              className="video-responsive"
              width={"100%"}
              height={"100%"}
              muted
              autoPlay
              loop
              poster={src as string}   
            >
              <source src={contentUrl as string} type={type}></source>
            </video>
          ) : null 
            : <div className="bg-pride img-placeholder img-responsive" data-initial={alt?.substring(0,2)}></div>
      }
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
