import { useMemo } from "react";
import SVG from "react-inlinesvg";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

type Stamp = {
  category: string;
  weight: number;
  label: string;
  icon: string;
  type: string;
};

type GroupedStamps = {
  [category: string]: Stamp[];
};

export default function GitcoinModalContent({ onClose, passport, profile }) {
  const groupedStamps: GroupedStamps = useMemo(() => {
    return passport.stamps.reduce((acc: GroupedStamps, stamp: Stamp) => {
      if (!acc[stamp.category]) {
        acc[stamp.category] = [];
      }
      acc[stamp.category].push(stamp);
      return acc;
    }, {});
  }, [passport.stamps]);

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <>
      <div
        className="modal-header"
        style={{
          ["--widget-primary-color" as string]: SocialPlatformMapping(
            PlatformType.gitcoin
          )?.color,
        }}
      >
        <div className="modal-cover gitcoin"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.gitcoin)?.icon}`}
            fill="#fff"
            width={14}
            height={14}
          />
        </div>
        <span className="modal-header-title">Gitcoin Passport</span>
      </div>
        <div className="modal-body">
          <Image
            width={80}
            height={80}
            className="avatar avatar-xl"
            alt={profile.identity}
            src={profile?.avatar}
          />
          <div className="d-flex mt-2" style={{ alignItems: "center", lineHeight: 1.25 }}>
            <strong className="h4 text-bold">{profile.displayName}</strong>
          </div>
          <div className="text-gray mt-1 mb-2">
            {profile.identity}
          </div>
          <div className="mt-2 mb-2">{profile?.description}</div>
          <div className="mt-4 mb-2">
            <div className="feed-token">
              <span className="text-large">🪪</span>
              <span className="feed-token-value">
                Humanity Score
              </span>
              <span className="feed-token-value text-bold">
                {passport.score}
              </span>
            </div>
          </div>

          {Object.keys(groupedStamps).length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-section">
                <div className="panel-section-title">Gitcoin Passport Stamps</div>
                <div className="panel-section-content">
                  {Object.entries(groupedStamps).map(([category, stamps]) => (
                    <div key={category} className="stamp-item">
                      <div className="stamp-item-body">
                        <div className="stamp-item-title">
                          <strong>{category}</strong>
                        </div>
                        <div className="stamp-item-subtitle">
                          {stamps.map((stamp) => (
                            <div
                              key={stamp.label}
                              className="stamp-label-item feed-token"
                              title={stamp.label}
                            >
                              <div className="feed-token-icon">
                                <Image
                                  alt={category}
                                  width={16}
                                  height={16}
                                  src={`https://passport.gitcoin.co/assets/${stamp.icon}`}
                                  className="icon"
                                />
                              </div>
                              <span className="feed-token-value">{stamp.label}</span>
                              <span className="feed-token-meta">{stamp.weight} points</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </>
    </>
  );
}
