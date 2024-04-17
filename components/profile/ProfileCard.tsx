import { formatText } from "../../utils/utils";
import SVG from "react-inlinesvg";
import Link from "next/link";
import Clipboard from "react-clipboard.js";
import { ProfileInterface } from "../../utils/profile";
import { Avatar } from "../shared/Avatar";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";

interface ProfileCardProps {
  data: ProfileInterface;
  simple?: boolean;
  classNames?: {
    [index: string]: string;
  };
}

export default function ProfileCard({
  data,
  simple,
  classNames,
}: ProfileCardProps) {
  const relatedPath = `${data?.identity}${
    data?.platform.toLowerCase() === PlatformType.farcaster ? ".farcaster" : ""
  }`;
  return (
    <div
      className={`profile-card ${classNames ? classNames?.["container"] : ""}`}
    >
      <div className="profile-card-header">
        <div className="profile-card-avatar">
          {(data?.avatar || data?.identity) && (
            <Avatar
              src={data?.avatar!}
              identity={data?.identity}
              className="avatar"
              alt={`${data?.displayName} Profile Photo`}
              height={40}
              width={40}
            />
          )}
        </div>
        <div className="profile-card-aside">
          <div className="profile-card-name">
            {data?.displayName || formatText(data?.identity)}
          </div>
          <div className="profile-card-meta">
            <SVG
              fill={SocialPlatformMapping(data?.platform).color}
              height={16}
              width={16}
              src={SocialPlatformMapping(data?.platform).icon || ""}
              title={SocialPlatformMapping(data?.platform).label}
            />
            {data?.identity === data?.address ||
            data?.identity === data?.displayName
              ? ""
              : `${data?.identity} ·`}
            <Clipboard
              component="div"
              className="profile-card-address c-hand"
              data-clipboard-text={data?.address}
              title="Copy the wallet address"
            >
              {formatText(data?.address)}
              <SVG
                src="../icons/icon-copy.svg"
                width={18}
                height={18}
                className="action"
              />
            </Clipboard>
          </div>
          {!simple && (
            <div className="profile-card-description">{data?.description}</div>
          )}
        </div>
      </div>
      {!simple && (
        <div className="profile-card-action">
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${relatedPath}`}
            prefetch={false}
            target="_blank"
            className="btn btn-sm btn-block"
          >
            View Profile
          </Link>
        </div>
      )}
    </div>
  );
}
