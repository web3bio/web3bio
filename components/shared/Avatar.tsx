import { AssetPlayerProps, NFTAssetPlayer } from "./NFTAssetPlayer";
import BoringAvatar from "boring-avatars";
import SVG from "react-inlinesvg";
import { useState } from "react";
interface Avatar extends AssetPlayerProps {
  useBoring?: boolean;
  fallbackImg?: string;
  fallbackClassName?: string;
}

export const Avatar = (props: Avatar) => {
  const { src, width, height, fallbackImg, fallbackClassName, useBoring, alt } =
    props;
  const [showFallback, setShowFallback] = useState(!src);
  
  return showFallback ? (
    !useBoring && fallbackImg ? (
      <div className={fallbackClassName}>
        <SVG src={fallbackImg || ""} width={width} height={width} />
      </div>
    ) : (
      <BoringAvatar
        size={width}
        name={alt}
        variant="bauhaus"
        colors={["#ECD7C8", "#EEA4BC", "#BE88C4", "#9186E7", "#92C9F9"]}
      />
    )
  ) : (
    <NFTAssetPlayer
      onErrorHandle={() => setShowFallback(true)}
      className="avatar"
      src={src}
      width={width}
      height={height}
    />
  );
};
