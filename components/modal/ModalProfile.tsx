import { PlatformType } from "../utils/platform";
import FarcasterProfileCard from "../profile/FarcasterProfileCard";
import LensProfileCard from "../profile/LensProfileCard";

export default function ProfileModalContent(props) {
  const { identity } = props;

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

  return <div className="modal-profile-container">{renderContent}</div>;
}
