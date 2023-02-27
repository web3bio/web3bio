import { memo, useEffect, useState } from "react";
import { getContractSpecImage } from "../../utils/domains";
import { ImageLoader } from "./ImageLoader";

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
  return ["video/mp4", "audio/mpeg", "audio/wav"].includes(type);
};

const RenderNFTAssetPlayer = (props) => {
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
  } = props;
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    const eipPrefix = "eip155:1/erc721:";
    if (src && src.startsWith(eipPrefix)) {
      const fetchSrc = async () => {
        const res = await getContractSpecImage(
          src.split(eipPrefix)[1].split("/")
        );
        setResolvedSrc(res);
      };
      fetchSrc().catch((e) => {
        setResolvedSrc("");
      });
    }
  }, [src]);
  return (
    <>
      {src ? (
        <div onClick={onClick} className={className} style={style}>
          {IsImage(type) ? (
            <ImageLoader
              width={width}
              height={height}
              src={type === "unknown" ? contentUrl : resolvedSrc}
              alt={alt}
            />
          ) : (
            isVideo(type) && (
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
            )
          )}
        </div>
      ) : (
        <div onClick={onClick} className={className} style={style}>
          <div
            className="img-placeholder img-responsive bg-pride"
            data-initial={alt?.substring(0, 2)}
          ></div>
        </div>
      )}
    </>
  );
};

export const NFTAssetPlayer = memo(RenderNFTAssetPlayer);
