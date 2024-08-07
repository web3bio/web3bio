import _ from "lodash";
import SVG from "react-inlinesvg";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

export default function GitcoinModalContent({ onClose, passport, profile }) {
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

          {passport?.stamps?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-widget">
                <div className="panel-widget-title">Gitcoin Passport Stamps</div>
                <div className="panel-widget-content">
                  
                  {passport?.stamps?.map((x) => {
                    return (
                      <div
                        key={x.key}
                        className="list-item"
                      >
                        <div className="list-item-icon">
                          <SVG
                            width={40}
                            height={40}
                            fill="#fff"
                            src={`https://passport.gitcoin.co/assets/${x.icon}`}
                            className="item-logo"
                          />
                        </div>
                        <div className="list-item-body">
                          <div className="list-item-title">
                            <strong>{x.category}</strong>{" "}
                          </div>
                          <div className="list-item-subtitle">
                            {x.label}
                          </div>
                          <div className="list-item-subtitle text-gray">
                            {x.weight} points
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
