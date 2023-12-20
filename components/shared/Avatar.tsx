import { AssetPlayerProps, NFTAssetPlayer } from "./NFTAssetPlayer";
interface Avatar extends AssetPlayerProps {
  identity?: string;
}

export const Avatar = (props: Avatar) => {
  const { src, width, height, alt, identity } = props;
  const profileAvatarAPIURL =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/avatar/${identity}`;
  return (
    <NFTAssetPlayer
      type="image/png"
      className="avatar"
      src={src || profileAvatarAPIURL}
      width={width}
      height={height}
      alt={alt}
      placeholder={true}
    />
  );
};
