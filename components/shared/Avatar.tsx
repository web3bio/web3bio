import Image from "next/image";
import { AssetPlayerProps } from "./NFTAssetPlayer";
import { profileAPIBaseURL } from "../utils/api";
interface Avatar extends AssetPlayerProps {
  identity?: string;
  itemProp?: string;
}

export const Avatar = (props: Avatar) => {
  const { src, width, height, alt, identity, itemProp, style } = props;
  const profileAvatarAPIURL = profileAPIBaseURL + `/avatar/svg?handle=${identity}`;
  return (
    <Image
      className="avatar"
      style={{
        width: width ? width : "100%",
        height: height ? height : "auto",
        ...style,
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
