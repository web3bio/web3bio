import _ from "lodash";
import SVG from "react-inlinesvg";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

export default function GitcoinModalContent({ onClose, passport, profile }) {
  const stamps = passport.stamps as { category: string; weight: number; label: string; icon: string; }[] | undefined;
  const groupedStamps = stamps 
    ? _.groupBy(stamps, 'category') 
    : {};

  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
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
          <div className="d-flex mt-2" style={{ alignItems: "center" }}>
            <strong className="h4 text-bold">{profile.displayName}</strong>
          </div>
          <div className="text-gray">
            {profile.identity}
          </div>
          <div className="mt-2 mb-2">{profile?.description}</div>
          <div className="mt-2 mb-2">
            Humanity Score <strong className="text-large">{passport.score}</strong>
          </div>

          {stamps && stamps.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-widget">
                <div className="panel-widget-title">Gitcoin Passport Stamps</div>
                <div className="panel-widget-content">
                  {Object.entries(groupedStamps).map(([category, categoryStamps]) => {
                    const typedCategoryStamps = categoryStamps as { 
                      weight: number; 
                      label: string; 
                      icon: string;
                      type: string;
                    }[];
                    
                    // const totalWeight = typedCategoryStamps.reduce((sum, stamp) => sum + stamp.weight, 0);
                    return (
                      <div
                        key={category}
                        className="stamp-item"
                      >
                        <div className="stamp-item-body">
                          <div className="stamp-item-title">
                            <strong>{category}</strong>{" "}
                          </div>
                          <div className="stamp-item-subtitle">
                            {typedCategoryStamps.map((x) => {
                              return (
                                <div
                                  key={x.label}
                                  className="stamp-label-item feed-token"
                                  title={x.label}
                                >
                                  <div className="feed-token-icon">
                                    <Image
                                      alt={category}
                                      width={16}
                                      height={16}
                                      src={`https://passport.gitcoin.co/assets/${x.icon}`}
                                      className="icon"
                                    />
                                  </div>
                                  <span className="feed-token-value">{x.label}</span>
                                  <span className="feed-token-meta">{x.weight} points</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </>
    </>
  );
}
