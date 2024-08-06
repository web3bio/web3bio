import SVG from "react-inlinesvg";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import Link from "next/link";

export default function DegenModalContent({ onClose, degen, profile }) {
  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>

      <div
        className="modal-header"
        style={{
          ["--widget-primary-color" as string]: SocialPlatformMapping(
            PlatformType.degenscore
          )?.color,
        }}
      >
        <div className="modal-cover guild"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.degenscore)?.icon}`}
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
        <div className="d-flex mt-2" style={{ alignItems: "center" }}>
          <strong className="h4 text-bold">{profile.displayName}</strong>
        </div>
        <div className="text-gray">
          {profile.displayName}
          <span> · </span>
          <span title="Guild ID">#{profile.identity || "…"}</span>
        </div>

        <div className="mt-2 mb-2">{profile?.description}</div>

        <div className="divider mt-4 mb-4"></div>
        <div className="panel-widget">
          <div className="panel-widget-title">
            Degen Score: {degen.properties?.DegenScore}
          </div>
        </div>
        
        {degen.traits.actions?.metadata.actions.actions && (
          <>
            <div className="divider mt-4 mb-4"></div>
            <div className="panel-widget">
              <div className="panel-widget-title">DegenScore Traits</div>
              <div className="panel-widget-content widget-trait-list">
                {(degen.traits.actions?.metadata.actions.actions).map(
                  (item, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`trait-item label ${item.actionTier?.toLowerCase()}`}
                        title={item.description}
                      >
                        {item.actionTier == "ACTION_TIER_LEGENDARY" && "💎 "}
                        {item.actionTier == "ACTION_TIER_EPIC" && "✨ "}
                        {item.name}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {degen?.external_url && (
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={degen.external_url}
              target="_blank"
              className="btn btn-primary"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in DegenScore.com
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
