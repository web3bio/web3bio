// ⚡️ snapshot
import SVG from "react-inlinesvg";
import _ from "lodash";
import Link from "next/link";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { Avatar } from "../shared/Avatar";
// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { fetchProfile } from "../hooks/fetchProfile";
import { formatText } from "../utils/utils";
import { isAddress } from "viem";

const spaceLinks = [
  PlatformType.twitter,
  PlatformType.website,
  PlatformType.github,
  PlatformType.coingecko,
];

export default function SnapshotModalContent({ onClose, space, profile }) {
  // const [members, setMembers] = useState(new Array());
  // const [admins, setAdmins] = useState(new Array());
  // const [moderators, setModerators] = useState(new Array());

  if (process.env.NODE_ENV !== "production") {
    console.log("base info: ", space, "profile:", profile);
  }

  // useEffect(() => {
  //   const fetchUserProfiles = async (
  //     arr: string[],
  //     setter: Dispatch<SetStateAction<any[]>>
  //   ) => {
  //     const responses = await Promise.allSettled(
  //       arr.map((x) =>
  //         fetchProfile({
  //           identity: x,
  //           platform: PlatformType.ethereum,
  //         })
  //       )
  //     ).then((res) => res.filter((x) => x.status === "fulfilled" && x.value));
  //     setter(responses.map((x) => (x as any).value));
  //   };
  //   if (!admins?.length && space?.admins?.length > 0) {
  //     setAdmins(space.admins);
  //   }
  //   if (!members?.length && space?.members?.length > 0) {
  //     setMembers(space.members);
  //   }

  //   if (!moderators?.length && space?.moderators?.length > 0) {
  //     setModerators(space.moderators);
  //   }
  //   if (admins?.length > 0 && admins.every((x) => typeof x === "string")) {
  //     fetchUserProfiles(admins, setAdmins);
  //   }
  //   if (members?.length > 0 && members.every((x) => typeof x === "string")) {
  //     fetchUserProfiles(members, setMembers);
  //   }
  //   if (
  //     moderators?.length > 0 &&
  //     moderators.every((x) => typeof x === "string")
  //   ) {
  //     fetchUserProfiles(moderators, setModerators);
  //   }
  // }, [space, members, admins, moderators]);

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
            <strong className="h4 text-bold mr-1">{space.name}</strong>
            {space.verified && (
              <SVG
                src={`icons/icon-badge.svg`}
                fill={"#121212"}
                width={20}
                height={20}
                title={"Verified Snapshot Space"}
              />
            )}
          </div>
          <div className="text-gray">{space.id}</div>

          <div className="mt-2 mb-2">
            <strong className="text-large">
              {space?.followersCount.toLocaleString()}
            </strong>{" "}
            Members{" "}
            <span> · </span>
            <strong className="text-large">
              {space?.proposalsCount.toLocaleString()}
            </strong>{" "}
            Proposals{" "}
          </div>
          <div className="mt-2 mb-2">{space?.about}</div>

          {spaceLinks.map((x) => space[x]).some((x) => !!x) && (
            <div className="btn-group mt-2 mb-2">
              {spaceLinks.map((x) => {
                return (
                  space[x] && (
                    <Link
                      href={SocialPlatformMapping(x).urlPrefix + space[x]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                    >
                      <SVG
                        src={
                          SocialPlatformMapping(x).icon ||
                          `../icons/icon-web.svg`
                        }
                        fill="#121212"
                        width={18}
                        height={18}
                      />
                      <span className="">
                        {SocialPlatformMapping(x).label}
                      </span>
                    </Link>
                  )
                );
              })}
            </div>
          )}

          {/* <div className="divider mt-4 mb-4"></div> */}
          {/* {admins?.some((x) => x.identity) &&
            renderUsersGroup("Admins", admins)}
          {moderators?.some((x) => x.identity) &&
            renderUsersGroup("Moderators", moderators)}
          {members?.some((x) => x.identity) &&
            renderUsersGroup("Authors", members)} */}

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
          </div>
        </div>
      </>
    </>
  );
}
