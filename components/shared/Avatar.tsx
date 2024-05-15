import Image from "next/image";
import { AssetPlayerProps } from "./NFTAssetPlayer";
import { useState } from "react";
interface Avatar extends AssetPlayerProps {
  identity?: string;
  itemProp?: string;
}

export const Avatar = (props: Avatar) => {
  const { src, width, height, alt, identity, itemProp } = props;
  const AvatarAPIFallback =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT +
    `/avatar/svg?handle=${identity}`;
  const [dataURL, setDataURL] = useState(src || AvatarAPIFallback);

  return (
    dataURL && (
      <Image
        className="avatar"
        style={{
          width: width ? width : "100%",
          height: height ? height : "auto",
        }}
        src={dataURL}
        onError={(e) => {
          setDataURL(AvatarAPIFallback);
        }}
        width={Number(width) || 0}
        height={Number(height) || 0}
        alt={alt}
        loading={"lazy"}
        itemProp={itemProp}
      />
    )
  );
};
