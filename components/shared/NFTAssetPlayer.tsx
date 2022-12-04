import { memo } from "react";
import { ImageLoader } from "./ImageLoader";
import { Video } from "./Video";
import { resolveIPFS_URL } from "../../utils/ipfs";

const IsImage = (type) => {
  return ["image/png", "image/jpeg", "image/jpg", "image/svg", "image/gif", "image/webp", "text/html"].includes(type);
};

const isVideo = (type) => {
  return ["video/mp4", "audio/mpeg", "audio/wav"].includes(type);
};

const isAudio = (type) => {
  return ["video/mp4", "audio/mpeg", "audio/wav"].includes(type);
};

const resolveMediaURL_New = (asset) => {
  if (asset) {
    return asset.startsWith('data:', 'https:') ? asset : resolveIPFS_URL(asset);
  }
  return '';
};

const RenderNFTAssetPlayer = (props) => {
  const { type = "image/png", className, src, contentUrl, width, height, alt } = props;
  return (
    <div className={className}>
      {IsImage(type) ? (
        <ImageLoader
          width={width ?? '100%'}
          height={height ?? '100%'}
          src={src}
          alt={alt}
          loading="lazy"
        />
      ) : isVideo(type) ? (
        <video
          style={{ borderRadius: 8 }}
          width={"100%"}
          height={"100%"}
          muted
          autoPlay
          loop
          poster={src as string}   
        >
          <source src={contentUrl as string} type={type}></source>
        </video>
      ) : (
        <></>
      )}
    </div>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
