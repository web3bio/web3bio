// snapshot
import SVG from "react-inlinesvg";
import _ from "lodash";
import Link from "next/link";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
import { useQuery } from "@apollo/client";
import { QUERY_SPACE_BY_ID } from "../apis/snapshot";
import { WidgetTypes } from "../utils/widgets";
import { chainIdToNetwork } from "../utils/network";
export default function GuildModalContent({ onClose, space, profile }) {
  const {
    data: spaceDetail,
    loading,
    error,
  } = useQuery(QUERY_SPACE_BY_ID, {
    variables: {
      id: space.id,
    },
    context: {
      clientName: WidgetTypes.snapshot,
    },
  });

  const _spaceDetail = spaceDetail?.space;
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "space base info: ",
      space,
      "space detail: ",
      spaceDetail,
      "profile:",
      profile
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
              PlatformType.snapshot
            )?.color,
          }}
        >
          <div className="modal-profile-cover snapshot"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.snapshot)?.icon}`}
              width={14}
              height={14}
            />
          </div>
          <span>{SocialPlatformMapping(PlatformType.snapshot).label}</span>
        </div>
        <div className="modal-profile-body">
          <Avatar
            width={80}
            height={80}
            className="avatar"
            alt={space.name}
            src={space?.avatar}
          />
          <div className="d-flex mt-2" style={{ alignItems: "center" }}>
            <strong className="h4 text-bold">{space.name}</strong>
          </div>
          <div className="text-gray">#{space.id}</div>
          {_spaceDetail && (
            <div className="mt-2 mb-2">
              <strong className="text-large">
                {_spaceDetail?.followersCount.toLocaleString()}
              </strong>{" "}
              Followers{" "}
              {_spaceDetail?.network && (
                <>
                  <span> · </span>
                  <strong className="text-large">
                    {chainIdToNetwork(_spaceDetail.network) ||
                      _spaceDetail.network}
                  </strong>{" "}
                  Chain
                </>
              )}
            </div>
          )}
          <div className="mt-2">{_spaceDetail?.about}</div>
          {/* {[]?.length > 0 && (
            <div className="panel-widget">
          
              <div className="panel-widget-content">
                {[].map((x) => {
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
                      <span className="feed-token-value">{x.name}</span>
                      <span className="feed-token-meta">
                        <SVG
                          src={"/icons/icon-groups.svg"}
                          width="20"
                          height="20"
                        />
                        {x.followersCount?.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )} */}

          {/* {rolesAcquired?.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="panel-widget">
                <div className="panel-widget-title">Roles acquired by {profile.displayName}</div>
                <div className="panel-widget-content">
                  {rolesAcquired.map((x) => {
                    return (
                      <div
                        key={x.id}
                        className="role-item feed-token"
                        title={x.description}
                      >
                        {x.imageUrl ? <Image
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
                            padding: x.imageUrl.includes("/guildLogos/") ? ".1rem": "auto",
                          }}
                        /> : <SVG src={"icons/icon-guild.svg"} fill={"#ccc"} width={20} height={20} />}
                        <span className="feed-token-value">{x.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )} */}
        </div>
        <div className="modal-profile-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://snapshot.org/#/${space.id}`}
              target="_blank"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in Snapshot.org
            </Link>
            {_spaceDetail?.website && (
              <Link
                href={_spaceDetail?.website}
                target="_blank"
                className="btn btn-primary"
              >
                <SVG src={"icons/icon-open.svg"} width={20} height={20} />
                Website
              </Link>
            )}
          </div>
        </div>
      </>
    </>
  );
}
