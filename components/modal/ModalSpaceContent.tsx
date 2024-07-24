// ⚡️ snapshot
import SVG from "react-inlinesvg";
import _ from "lodash";
import Link from "next/link";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
import { useQuery } from "@apollo/client";
import { QUERY_SPACE_BY_ID } from "../apis/snapshot";
import { WidgetTypes } from "../utils/widgets";
import { chainIdToNetwork } from "../utils/network";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchProfile } from "../hooks/fetchProfile";
import { formatText } from "../utils/utils";
import { isAddress } from "viem";

export default function GuildModalContent({ onClose, space, profile }) {
  const [members, setMembers] = useState(new Array());
  const [admins, setAdmins] = useState(new Array());
  const [mods, setMods] = useState(new Array());
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

  // if (process.env.NODE_ENV !== "production") {
  //   console.log(
  //     "space base info: ",
  //     space,
  //     "space detail: ",
  //     spaceDetail,
  //     "profile:",
  //     profile
  //   );
  // }

  useEffect(() => {
    const fetchUserProfiles = async (
      arr: string[],
      setter: Dispatch<SetStateAction<any[]>>
    ) => {
      const responses = await Promise.allSettled(
        arr.map((x) =>
          fetchProfile({
            identity: x,
            platform: PlatformType.ethereum,
          })
        )
      ).then((res) => res.filter((x) => x.status === "fulfilled" && x.value));
      setter(responses.map((x) => (x as any).value));
    };
    if (!admins?.length && _spaceDetail?.admins?.length > 0) {
      setAdmins(_spaceDetail.admins);
    }
    if (!members?.length && _spaceDetail?.members?.length > 0) {
      setMembers(_spaceDetail.members);
    }

    if (!mods?.length && _spaceDetail?.moderators?.length > 0) {
      setMods(_spaceDetail.moderators);
    }
    if (admins?.length > 0 && admins.every((x) => typeof x === "string")) {
      fetchUserProfiles(admins, setAdmins);
    }
    if (members?.length > 0 && members.every((x) => typeof x === "string")) {
      fetchUserProfiles(members, setMembers);
    }
    if (mods?.length > 0 && mods.every((x) => typeof x === "string")) {
      fetchUserProfiles(mods, setMods);
    }
  }, [_spaceDetail, members, admins, mods]);

  const renderUsersGroup = (title, users) => {
    return (
      <>
        <div className="divider"></div>
        <div className="panel-widget">
          <div className="panel-widget-title">{title}</div>
          <div className="panel-widget-content">
            {users.map((x) => {
              return (
                <Link
                  href={`/${x.identity}`}
                  key={x.id}
                  className="role-item feed-token"
                  title={x.description}
                  target="_blank"
                >
                  {
                    <Avatar
                      alt={x.displayName}
                      width={20}
                      height={20}
                      src={x.avatar}
                      className={"role-item-icon feed-token-icon"}
                    />
                  }
                  <span className="feed-token-value">
                    {isAddress(x.identity)
                      ? formatText(x.identity)
                      : x.identity || formatText(x)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  };
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
          {admins?.length > 0 && renderUsersGroup("Admins", admins)}
          {mods?.length > 0 && renderUsersGroup("Mods", mods)}
          {members?.length > 0 && renderUsersGroup("Members", members)}
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
