import SVG from "react-inlinesvg";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { NetworkMapping } from "../utils/network";
import { GUILD_XYZ_ENDPOINT, GuildFetcher } from "../utils/api";

const RoleItem = ({ role, showMemberCount }) => (
  <div className="role-item feed-token" title={role.description}>
    {role.imageUrl ? (
      <Image
        alt={role.name}
        width={20}
        height={20}
        src={role.imageUrl.includes("/guildLogos/") ? `https://guild.xyz${role.imageUrl}` : role.imageUrl}
        className="role-item-icon feed-token-icon"
        style={{
          background: role.imageUrl.includes("/guildLogos/") ? "#000" : "unset",
          padding: role.imageUrl.includes("/guildLogos/") ? ".1rem" : "auto",
        }}
      />
    ) : (
      <SVG src="icons/icon-guild.svg" fill="#ccc" width={20} height={20} />
    )}
    <span className="feed-token-value">{role.name}</span>
    {showMemberCount && (
      <span className="feed-token-meta">
        <SVG src="/icons/icon-groups.svg" width="20" height="20" />
        {role.memberCount?.toLocaleString()}
      </span>
    )}
  </div>
);

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
  const rolesAcquired = guildRoles?.filter((i) => guild.roleIds.includes(i.id)) || [];

  // if (process.env.NODE_ENV !== "production") {
  //   console.log(
  //     "baseInfo:",
  //     guild,
  //     "roles:",
  //     guildRoles,
  //     "details:",
  //     guildDetail,
  //     "rolesAcquired:",
  //     rolesAcquired,
  //   );
  // }

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
              PlatformType.guild
            )?.color,
          }}
        >
          <div className="modal-cover guild"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.guild)?.icon}`}
              fill="#fff"
              width={14}
              height={14}
            />
          </div>
          <span className="modal-header-title">Guild</span>
        </div>
        <div className="modal-body">
          <Image
            width={80}
            height={80}
            className="avatar avatar-xl"
            alt={guild.name}
            src={guild?.imageUrl}
          />
          <div className="d-flex mt-2" style={{ alignItems: "center", lineHeight: 1.25 }}>
            <strong className="h4 text-bold">{guild.name}</strong>
          </div>
          <div className="text-gray mt-1 mb-2">
            {guild.urlName}
            <span> · </span>
            <span title="Guild ID">#{guild.id}</span>
          </div>
          <div className="mt-2 mb-2">
            <strong className="text-large">
              {guild?.memberCount.toLocaleString()}
            </strong>{" "}
            Members{" "}
            {guildDetail?.guildPin?.chain && (
              <>
                <span> · </span>
                <strong className="text-large">
                  {
                    NetworkMapping(guildDetail.guildPin?.chain.toLowerCase())
                      .label
                  }
                </strong>{" "}
                Chain
              </>
            )}
          </div>
          <div className="mt-2 mb-2">{guildDetail?.description}</div>
          {Object.keys(guildDetail?.socialLinks || {})?.length > 0 && (
            <div className="mt-2 mb-2 btn-group">
              {Object.keys(guildDetail.socialLinks).map((x) => {
                const href = guildDetail.socialLinks[x];
                const platformKey = x.toLowerCase() as PlatformType;
                return (
                  <Link
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                  >
                    <SVG
                      src={
                        SocialPlatformMapping(platformKey).icon ||
                        `../icons/icon-web.svg`
                      }
                      fill="#121212"
                      width={18}
                      height={18}
                    />
                    <span className="">
                      {SocialPlatformMapping(platformKey).label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
          {guildRoles?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-section">
                <div className="panel-section-title">Guild Roles</div>
                <div className="panel-section-content">
                  {guildRoles.map((role) => (
                    <RoleItem key={role.id} role={role} showMemberCount={true} />
                  ))}
                </div>
              </div>
            </>
          )}

          {rolesAcquired?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-section">
                <div className="panel-section-title">
                  Roles acquired by {profile.displayName}
                </div>
                <div className="panel-section-content">
                  {rolesAcquired.map((role) => (
                    <RoleItem key={role.id} role={role} showMemberCount={false} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://guild.xyz/${guild.urlName}`}
              target="_blank"
              rel="noopener noreferrer"
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
