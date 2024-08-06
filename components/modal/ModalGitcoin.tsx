import SVG from "react-inlinesvg";
import _ from "lodash";
import Image from "next/image";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";

export default function GitcoinModalContent({ onClose, passport, profile }) {
  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <>
        <div className="modal-header">
          <div className="platform-icon">
            {WidgetInfoMapping(WidgetTypes.gitcoin).icon}
          </div>
          <span className="modal-header-title">Gitcoin</span>
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
            <div className="panel-widget-content">
              <div className="content">
                Humanity Score <strong>{passport.score}</strong>
              </div>
            </div>
          </div>
          {passport?.stamps?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-widget">
                <div className="panel-widget-title">Gitcoin Stamps</div>
                <div className="panel-widget-content">
                  {passport?.stamps?.map((x) => {
                    return (
                      <div
                        key={x.key}
                        className={`role-item feed-token ${
                          x.weight > 2 && "label-tier-rare "
                        }`}
                        title={x.label}
                      >
                        {"🌀"}
                        {x.weight >= 2 && "💎 "}
                        {x.label}
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
