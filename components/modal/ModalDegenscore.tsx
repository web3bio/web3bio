import SVG from "react-inlinesvg";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import Link from "next/link";

export default function DegenscoreModalContent({ onClose, degenscore, profile }) {
  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>

      <div
        className="modal-header"
        style={{
          ["--widget-primary-color" as string]: SocialPlatformMapping(
            PlatformType.degenscore
          )?.color,
        }}
      >
        <div className="modal-cover degenscore"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.degenscore)?.icon}`}
            fill="#fff"
            width={14}
            height={14}
          />
        </div>
        <span className="modal-header-title">DegenScore</span>
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
            <span className="text-large">👾</span>
            <span className="feed-token-value">
              DegenScore
            </span>
            <span className="feed-token-value text-bold">
              {degenscore.properties?.DegenScore}
            </span>
          </div>
        </div>
        
        {degenscore.traits.actions?.metadata.actions.actions && (
          <>
            <div className="divider mt-4 mb-4"></div>
            <div className="panel-section">
              <div className="panel-section-title">DegenScore Onchain Actions</div>
              <div className="panel-section-content">
                <div className="widget-trait-list">
                  {(degenscore.traits.actions?.metadata.actions.actions).map(
                    (item, idx) => {
                      return (
                        <div
                          key={idx}
                          className={`trait-item feed-token ${item.actionTier?.toLowerCase()}`}
                          title={item.description}
                        >
                          {item.actionTier == "ACTION_TIER_LEGENDARY" && "💎 "}
                          {item.actionTier == "ACTION_TIER_EPIC" && "✨ "}
                          <span className="feed-token-value">{item.name}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {degenscore?.external_url && (
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={degenscore.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in DegenScore
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
