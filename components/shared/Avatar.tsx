import Image from "next/image";
import { AssetPlayerProps } from "./NFTAssetPlayer";
interface Avatar extends AssetPlayerProps {
  identity?: string,
  itemProp?: string;
}

export const Avatar = (props: Avatar) => {
  const { src, width, height, alt, identity, itemProp } = props;
  const profileAvatarAPIURL =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/avatar/${identity}`;
  return (
    <Image
      className="avatar"
      style={{
        width: width ? width : "100%",
        height: height ? height : "auto",
      }}
      src={src || profileAvatarAPIURL}
      width={Number(width) || 0}
      height={Number(height) || 0}
      alt={alt}
      loading={"lazy"}
      itemProp={itemProp}
    />
  );
};
