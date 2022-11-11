import { memo } from "react";
import { ImageLoader } from "./ImageLoader";
import { Video } from "./Video";

const IsImage = (type) => {
  return [
    "image/png",
    "image/jepg",
    "image/jpg",
    "image/svg",
    "text/html",
  ].includes(type);
};

const isVideo = (type) => {
  return type === "vedio/mp4";
};

const RenderNFTAssetPlayer = (props) => {
  const { type, className, src } = props;
  return (
    <div className={className}>
      {IsImage(type) ? <ImageLoader src={src} /> : <Video src={src} />}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
