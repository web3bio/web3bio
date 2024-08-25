import SVG from "react-inlinesvg";
import Link from "next/link";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

const spaceLinks = [
  PlatformType.twitter,
  PlatformType.website,
  PlatformType.github,
  PlatformType.coingecko,
];

interface SpaceLinkProps {
  platform: PlatformType;
  url: string;
}

const SpaceLink = ({ platform, url }: SpaceLinkProps) => (
  <Link
    href={SocialPlatformMapping(platform).urlPrefix + url}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-sm"
  >
    <SVG
      src={SocialPlatformMapping(platform).icon || `../icons/icon-web.svg`}
      fill="#121212"
      width={18}
      height={18}
    />
    <span>{SocialPlatformMapping(platform).label}</span>
  </Link>
);

export default function SnapshotModalContent({ onClose, space, profile }) {
  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Snapshot:", space);
  // }

  const renderSpaceLinks = () => (
    <div className="btn-group mt-2 mb-2">
      {spaceLinks.map(platform => 
        space[platform] ? (
          <SpaceLink key={platform} platform={platform} url={space[platform]} />
        ) : null
      )}
    </div>
  );

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <div
        className="modal-header"
        style={{
          ["--widget-primary-color" as string]: SocialPlatformMapping(
            PlatformType.snapshot
          ).color,
        }}
      >
        <div className="modal-cover snapshot"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.snapshot).icon}`}
            fill="#fff"
            width={14}
            height={14}
          />
        </div>
        <span className="modal-header-title">{SocialPlatformMapping(PlatformType.snapshot).label}</span>
      </div>
      <div className="modal-body">
        <Image
          width={80}
          height={80}
          className="avatar avatar-xl"
          alt={space.name}
          src={space?.avatar}
          priority
        />
        <div className="d-flex mt-2" style={{ alignItems: "center", lineHeight: 1.25 }}>
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
        <div className="text-gray mt-1 mb-2">#{space.id}</div>

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
        {space.about && <div className="mt-2 mb-2">{space.about}</div>}

        {spaceLinks.some(platform => space[platform]) && renderSpaceLinks()}
      </div>
      <div className="modal-footer">
        <div className="btn-group btn-group-block">
          <Link
            href={`https://snapshot.org/#/${space.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            <SVG src={"icons/icon-open.svg"} width={20} height={20} />
            Open in Snapshot
          </Link>
        </div>
      </div>
    </>
  );
}
