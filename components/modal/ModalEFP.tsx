import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import Image from "next/image";
import useSWR from "swr";
import { EFP_ENDPOINT, ProfileFetcher } from "../utils/api";
export default function EFPModalContent(props) {
  const { onClose, profile } = props;
  const { data, isLoading, error } = useSWR(
    `${EFP_ENDPOINT}/v1/users/${profile.address}/followers`,
    ProfileFetcher
  );
  console.log(data, "followers data");
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
              PlatformType.efp
            )?.color,
          }}
        >
          <div className="modal-cover gitcoin"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.efp)?.icon}`}
              fill="#fff"
              width={14}
              height={14}
            />
          </div>
          <span className="modal-header-title">Ethereum Follow Protocal</span>
        </div>
        <div className="modal-body">
          {profile?.avatar && (
            <Image
              width={80}
              height={80}
              className="avatar avatar-xl"
              alt={profile.identity}
              src={profile?.avatar}
            />
          )}
          <div
            className="d-flex mt-2"
            style={{ alignItems: "center", lineHeight: 1.25 }}
          >
            <strong className="h4 text-bold">{profile.displayName}</strong>
          </div>
          <div className="text-gray mt-1 mb-2">{profile.identity}</div>
          <div className="mt-2 mb-2">{profile?.description}</div>

          {/* {Object.keys(groupedStamps).length > 0 && (
          <>
            <div className="panel-section">
              <div className="panel-section-title">
                Gitcoin Passport Stamps
                <div className="divider"></div>
              </div>
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
        )} */}
        </div>
      </>
    </>
  );
}
