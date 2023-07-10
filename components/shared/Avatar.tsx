import { AssetPlayerProps, NFTAssetPlayer } from "./NFTAssetPlayer";
import SVG from "react-inlinesvg";
interface Avatar extends AssetPlayerProps {
  fallbackImg?: string;
  fallbackClassName?: string;
}

export const Avatar = (props: Avatar) => {
  const { src, width, height, fallbackImg, fallbackClassName } = props;
  return src ? (
    <NFTAssetPlayer
      className="avatar"
      src={src}
      width={width}
      height={height}
    />
  ) : (
    <div className={fallbackClassName}>
      <SVG src={fallbackImg || ""} width={width} height={width} />
    </div>
  );
};
