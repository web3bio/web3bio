import SVG from "react-inlinesvg";
import { PlatformType } from "../utils/platform";
import FarcasterProfile from "./ModalProfileFarcaster";
import LensProfile from "./ModalProfileLens";

export default function ProfileModalContent(props) {
  const { identity, onClose } = props;
  const renderContent = (() => {
    switch (identity.platform) {
      case PlatformType.farcaster:
        return <FarcasterProfile {...identity} />;
      case PlatformType.lens:
        return <LensProfile {...identity} />;
      default:
        return null;
    }
  })();

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      {renderContent}
    </>
  );
}
