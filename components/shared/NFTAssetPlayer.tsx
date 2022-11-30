import { memo } from "react";
import { DefaultIcon } from "./Default";
import { ImageLoader } from "./ImageLoader";
import { Video } from "./Video";

const IsImage = (type) => {
  return ["image/png", "image/jpeg", "image/jpg", "image/svg"].includes(type);
};

const isVideo = (type) => {
  return type === "video/mp4";
};

const RenderNFTAssetPlayer = (props) => {
  const { type = "image/png", className, src, width, height, alt } = props;
  return (
    <div className={className}>
      {IsImage(type) ? (
        <ImageLoader
          width={width ?? '100%'}
          height={height ?? '100%'}
          src={src || DefaultIcon}
          alt={alt}
        />
      ) : isVideo(type) ? (
        <Video src={src} />
      ) : (
        <picture>
          <img
          src={src|| DefaultIcon}
            data-src={src || DefaultIcon}
            width={width ?? "100%"}
            height={height ?? '100%'}
            alt={alt}
          />
        </picture>
      )}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
