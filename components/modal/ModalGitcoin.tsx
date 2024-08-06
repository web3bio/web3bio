import SVG from "react-inlinesvg";
import _ from "lodash";
import Link from "next/link";
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
              PlatformType.guild
            )?.color,
          }}
        >
          <div className="modal-cover guild"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.guild)?.icon}`}
              width={14}
              height={14}
            />
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

          {passport?.stamps?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-widget">
                <div className="panel-widget-title">Guild Roles</div>
                <div className="panel-widget-content">
                  {passport?.stamps?.map((x) => {
                    return (
                      <div
                        key={x.id}
                        className="role-item feed-token"
                        title={x.description}
                      >
                        {x.imageUrl ? (
                          <Image
                            alt={x.name}
                            width={20}
                            height={20}
                            src={
                              x.imageUrl.includes("/guildLogos/")
                                ? `https://guild.xyz${x.imageUrl}`
                                : x.imageUrl
                            }
                            className={"role-item-icon feed-token-icon"}
                            style={{
                              background: x.imageUrl.includes("/guildLogos/")
                                ? "#000"
                                : "unset",
                              padding: x.imageUrl.includes("/guildLogos/")
                                ? ".1rem"
                                : "auto",
                            }}
                          />
                        ) : (
                          <SVG
                            src={"icons/icon-guild.svg"}
                            fill={"#ccc"}
                            width={20}
                            height={20}
                          />
                        )}
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
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://guild.xyz/${profile.urlName}`}
              target="_blank"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in Gitcoin
            </Link>
          </div>
        </div>
      </>
    </>
  );
}
