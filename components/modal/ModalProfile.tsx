import SVG from "react-inlinesvg";
import { PlatformType } from "../utils/platform";
import FarcasterProfileCard from "./FarcasterProfileCard";
import LensProfileCard from "./LensProfileCard";

export default function ProfileModalContent(props) {
  const { identity, onClose } = props;

  const renderContent = (() => {
    switch (identity.platform) {
      case PlatformType.farcaster:
        return <FarcasterProfileCard {...identity} />;
      case PlatformType.lens:
        return <LensProfileCard {...identity} />;
      default:
        return null;
    }
  })();

  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      {renderContent}
    </>
  );
}
