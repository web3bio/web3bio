import { AssetPlayerProps, NFTAssetPlayer } from "./NFTAssetPlayer";
import BoringAvatar from "boring-avatars";
interface Avatar extends AssetPlayerProps {
  identity?: string
}

export const Avatar = (props: Avatar) => {
  const { src, width, height, alt, identity } = props;

  return src ? (
      <NFTAssetPlayer
        type="image/png"
        className="avatar"
        src={src}
        width={width}
        height={height}
        alt={alt}
        placeholder={true}
      />
    ) : (
      <BoringAvatar
        size="100%"
        name={identity}
        variant="bauhaus"
        colors={["#ECD7C8", "#EEA4BC", "#BE88C4", "#9186E7", "#92C9F9"]}
      />
    );
};
