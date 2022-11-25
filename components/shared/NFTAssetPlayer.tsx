import { memo } from "react";
import { DefaultIcon } from "./Default";
import { ImageLoader } from "./ImageLoader";
import { Video } from "./Video";

const IsImage = (type) => {
  return ["image/png", "image/jepg", "image/jpg", "image/svg"].includes(type);
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
          width={width ?? 24}
          height={height ?? 24}
          src={src || DefaultIcon}
          alt={alt}
        />
      ) : isVideo(type) ? (
        <Video src={src} />
      ) : (
        <picture>
          <img
            data-src={src || DefaultIcon}
            src={src || DefaultIcon}
            width={width ?? "100%"}
            height={height}
            alt={alt}
          />
        </picture>
      )}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
