import SVG from "react-inlinesvg";
import useSWR from "swr";
import _ from "lodash";
import { GUILD_XYZ_ENDPOINT, GuildFetcher } from "../apis/guild";
import Link from "next/link";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
import Image from "next/image";
export default function GuildModalContent({ onClose, guild, profile }) {
  const { data: guildRoles } = useSWR(
    `${GUILD_XYZ_ENDPOINT}/guilds/${guild.id}/roles`,
    GuildFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: guildDetail } = useSWR(
    `${GUILD_XYZ_ENDPOINT}/guilds/${guild.id}`,
    GuildFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "baseInfo:",
      guild,
      "roles:",
      guildRoles,
      "details:",
      guildDetail
    );
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
          <span>Guild</span>
        </div>
        <div className="modal-profile-body">
          <Avatar
            width={80}
            height={80}
            className="avatar"
            alt={guild.name}
            src={guild?.imageUrl}
            style={{
              background: guild?.imageUrl?.includes("/guildLogos/")
                ? "#000"
                : "",
            }}
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
          {guildRoles?.length > 0 && (
            <div className="panel-widget">
              <div className="panel-widget-title">Guild Roles</div>
              <div className="panel-widget-content">
                {guildRoles.map((x) => {
                  return (
                    <div
                      key={x.id}
                      className="role-item feed-token"
                      title={x.description}
                    >
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
                        }}
                      />
                      <span className="feed-token-value">{x.name}</span>
                      <span className="feed-token-meta">{x.memberCount?.toLocaleString()} Members</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mt-2 mb-4">
            <strong className="text-large">{guild?.memberCount}</strong> Members{" "}
            {guildDetail?.guildPin?.chain && (
              <>
                <span> · </span>
                <strong className="text-large">
                  {guildDetail.guildPin?.chain}
                </strong>{" "}
                Chain
              </>
            )}
          </div>

          {guild.roleIds?.length > 0 && guildRoles && (
            <>
              <div className="divider"></div>
              <div className="mt-2 mb-4">
                Roles with {profile.displayName}:{" "}
                <span className="text-bold">
                  {guild.roleIds
                    .map((x) => guildRoles.find((i) => i.id === x)?.name)
                    .join(" , ")}
                </span>
              </div>
            </>
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
            {guild?.eventSources?.LUMA && (
              <Link
                href={guild?.eventSources?.LUMA}
                target="_blank"
                className="btn"
              >
                <SVG src={"icons/icon-open.svg"} width={20} height={20} />
                Events
              </Link>
            )}
          </div>
        </div>
      </>
    </>
  );
}
