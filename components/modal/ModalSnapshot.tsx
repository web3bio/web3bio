// ⚡️ snapshot
import SVG from "react-inlinesvg";
import _ from "lodash";
import Link from "next/link";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
import { useQuery } from "@apollo/client";
import { QUERY_SPACE_BY_ID } from "../apis/snapshot";
import { WidgetTypes } from "../utils/widgets";
import { NetworkMapping, chainIdToNetwork } from "../utils/network";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchProfile } from "../hooks/fetchProfile";
import { formatText } from "../utils/utils";
import { isAddress } from "viem";

export default function SnapshotModalContent({ onClose, space, profile }) {
  const [members, setMembers] = useState(new Array());
  const [admins, setAdmins] = useState(new Array());
  const [moderators, setModerators] = useState(new Array());
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

    if (!moderators?.length && _spaceDetail?.moderators?.length > 0) {
      setModerators(_spaceDetail.moderators);
    }
    if (admins?.length > 0 && admins.every((x) => typeof x === "string")) {
      fetchUserProfiles(admins, setAdmins);
    }
    if (members?.length > 0 && members.every((x) => typeof x === "string")) {
      fetchUserProfiles(members, setMembers);
    }
    if (moderators?.length > 0 && moderators.every((x) => typeof x === "string")) {
      fetchUserProfiles(moderators, setModerators);
    }
  }, [_spaceDetail, members, admins, moderators]);

  const renderUsersGroup = (title, users) => {
    return (
      <>
        <div className="panel-widget">
          <div className="panel-widget-title">{title}</div>
          <div className="panel-widget-content">
            {users.map((x) => {
              return (
                <Link
                  href={`/${x.identity}`}
                  key={x.id}
                  className="role-item feed-token c-hand"
                  title={x.description}
                  target="_blank"
                >
                  <Avatar
                    alt={x.displayName}
                    width={20}
                    height={20}
                    src={x.avatar}
                    identity={x.identity}
                    className={"role-item-icon feed-token-icon"}
                  />
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
          <Image
            width={80}
            height={80}
            className="avatar avatar-xl"
            alt={space.name}
            src={space?.avatar}
          />
          <div className="d-flex mt-2" style={{ alignItems: "center" }}>
            <strong className="h4 text-bold">{space.name}</strong>
          </div>
          <div className="text-gray">{space.id}</div>
          {_spaceDetail && (
            <div className="mt-2 mb-2">
              <strong className="text-large">
                {_spaceDetail?.followersCount.toLocaleString()}
              </strong>{" "}
              Members{" "}
              {_spaceDetail?.network && (
                <>
                  <span> · </span>
                  <strong className="text-large">
                    {NetworkMapping(chainIdToNetwork(_spaceDetail.network) ||
                      _spaceDetail.network).label}
                  </strong>{" "}
                  Chain
                </>
              )}
            </div>
          )}
          <div className="mt-2">{_spaceDetail?.about}</div>
          <div className="divider mt-4 mb-4"></div>

          {admins?.length > 0 && renderUsersGroup("Admins", admins)}
          {moderators?.length > 0 && renderUsersGroup("Moderators", moderators)}
          {members?.length > 0 && renderUsersGroup("Authors", members)}
        </div>
        <div className="modal-profile-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://snapshot.org/#/${space.id}`}
              target="_blank"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in Snapshot
            </Link>
            {_spaceDetail?.website && (
              <Link
                href={_spaceDetail?.website}
                target="_blank"
                className="btn"
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
