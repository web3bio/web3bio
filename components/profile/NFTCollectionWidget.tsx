import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/platform";
import { formatText } from "../../utils/utils";

const RenderNFTCollectionWidget = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const { identity } = props;
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className='profile-widget profile-collection-widgets'>
      <div
        className="platform-icon"
        style={{ background: SocialPlatformMapping(PlatformType.twitter)?.color }}
      >
        <SVG src="/icons/icon-view.svg" width={24} height={24} />
      </div>
      <div className="platform-title">Collections</div>
      <div className="platform-handle">{identity.displayName}</div>
      {/* <div className="platform-action">
        <div className="btn btn-sm">Open</div>
      </div> */}
    </div>
  );
};

export const NFTCollectionWidget = memo(RenderNFTCollectionWidget);
