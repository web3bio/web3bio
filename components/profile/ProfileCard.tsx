import { useState } from "react";
import Link from "next/link";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { ProfileInterface } from "../utils/types";
import { formatText, colorMod } from "../utils/utils";
import { Avatar } from "../shared/Avatar";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

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
  const [isCopied, setIsCopied] = useState(false);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  return (
    <div
      className={`profile-card ${classNames ? classNames?.["container"] : ""}`}
    >
      <div className="profile-card-header">
        <div className="profile-card-avatar">
          {(data?.avatar || data?.identity) && (
            <>
              <Avatar
                src={data?.avatar!}
                identity={data?.identity}
                className="avatar"
                alt={`${data?.displayName} Profile Photo`}
                height={40}
                width={40}
              />
              <div
                className={`profile-card-platform ${data?.platform}`}
                style={{
                  ["--badge-primary-color" as string]:
                    SocialPlatformMapping(data?.platform).color || "#000",
                  ["--badge-bg-color" as string]:
                    colorMod(
                      SocialPlatformMapping(data?.platform)?.color,
                      90
                    ),
                }}
                title={SocialPlatformMapping(data?.platform).label}
              >
                <SVG
                  fill={"#fff"}
                  src={SocialPlatformMapping(data?.platform).icon || ""}
                  height={16}
                  width={16}
                />
              </div>
            </>
          )}
        </div>
        <div className="profile-card-aside">
          <div className="profile-card-name">
            {data?.displayName || formatText(data?.identity)}
          </div>
          <div className="profile-card-meta">
            {data?.identity === data?.address ||
            data?.identity === data?.displayName
              ? ""
              : `${data?.identity} ·`}
            <Clipboard
              component="div"
              className="profile-card-address c-hand"
              data-clipboard-text={data?.address || data?.identity}
              title="Copy the wallet address"
              onSuccess={onCopySuccess}
            >
              {formatText(data?.address || data?.identity)}
              <SVG
                src={isCopied ? "../icons/icon-check.svg" : "../icons/icon-copy.svg"}
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
            <SVG
              src={"../icons/icon-open.svg"}
              width={18}
              height={18}
              className="action"
            />
            View Profile
          </Link>
        </div>
      )}
    </div>
  );
}
