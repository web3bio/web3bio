import SVG from "react-inlinesvg";
import useSWR from "swr";
import { SimplehashFetcher } from "../apis/simplehash";
import _ from "lodash";
import { GUILD_XYZ_ENDPOINT } from "../apis/guild";
import Link from "next/link";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
import Image from "next/image";
export default function GuildModalContent({ onClose, guild }) {
  const { data: guildDetail } = useSWR(
    `${GUILD_XYZ_ENDPOINT}/guilds/guild-page/${guild.urlName}`,
    SimplehashFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (guildDetail) {
    console.log("baseInfo:", guild, "detail:", guildDetail);
  }
  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <>
        <div
          className="modal-profile-header"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(
              PlatformType.guild
            )?.color,
          }}
        >
          <div className="modal-profile-cover guild"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.guild)?.icon}`}
              width={14}
              height={14}
            />
          </div>
          <span>Guildhall</span>
        </div>
        <div className="modal-profile-body">
          <Avatar
            width={80}
            height={80}
            className="avatar"
            alt={guild.name}
            src={guild?.imageUrl}
          />
          <div className="d-flex mt-4" style={{ alignItems: "center" }}>
            <strong className="h4 text-bold">{guild.name}</strong>
            {guild.tags?.includes("VERIFIED") ? (
              <div
                className="active-badge"
                style={{ background: "transparent" }}
              >
                💎
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="text-gray">
            @{guild.urlName}
            <span> · </span>
            <span title="Guild ID">#{guild.id || "…"}</span>
          </div>
          <div className="mt-2">{guildDetail?.description}</div>

          {guildDetail && (
            <div className="mt-2 mb-4">
              <strong className="text-large">{guildDetail?.memberCount}</strong>{" "}
              Members{" "}
              {guildDetail?.guildPin?.chain && (
                <>
                  · <strong>{guildDetail.guildPin?.chain}</strong>
                </>
              )}
            </div>
          )}

          <div className="divider"></div>
          {guildDetail?.roles?.length > 0 && (
            <div className="panel-widget">
              <div className="panel-widget-title">Roles</div>
              <div className="panel-widget-content">
                {guildDetail.roles.map((x) => {
                  return (
                    <Link
                      key={x.id}
                      href={`https://guild.xyz/${guild.urlName}`}
                      className="channel-item"
                      target="_blank"
                    >
                      <Image
                        alt={x.name}
                        width={40}
                        height={40}
                        src={
                          x.imageUrl.includes("/guildLogos/")
                            ? `https://guild.xyz${x.imageUrl}`
                            : x.imageUrl
                        }
                        color={
                          SocialPlatformMapping(PlatformType.guild).color || ""
                        }
                        className={"channel-item-icon"}
                        style={{
                          background: x.imageUrl.includes("/guildLogos/")
                            ? "#000"
                            : "unset",
                        }}
                      />
                      <div className="channel-item-body">
                        <div className="channel-item-title">
                          <strong>{x.name}</strong>{" "}
                          <span className="text-gray">#{x.id}</span>
                        </div>
                        <div className="channel-item-subtitle">
                          {x.description}
                        </div>
                        <div className="channel-item-subtitle text-gray">
                          {x.memberCount?.toLocaleString()} Members
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="modal-profile-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://guild.xyz/${guild.urlName}`}
              target="_blank"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in Guild.xyz
            </Link>
            {guildDetail?.eventSources?.LUMA && (
              <Link
                href={guildDetail?.eventSources?.LUMA}
                target="_blank"
                className="btn btn-primary"
              >
                <SVG src={"icons/icon-open.svg"} width={20} height={20} />
                Event Source
              </Link>
            )}
          </div>
        </div>
      </>
    </>
  );
}
