import Link from "next/link";
import SVG from "react-inlinesvg";
import { PlatformType } from "../utils/platform";
import { ActivityType } from "../utils/activity";
export const domainRegexp =
  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;

const ExternalLink = ({ url }) => {
  if (!url) return null;
  
  const domain = domainRegexp.exec(url)?.[1] || "External Link";
  
  return (
    <li className="menu-item dropdown-menu-item">
      <Link prefetch={false} href={url} target="_blank">
        <SVG
          src="../icons/icon-search.svg"
          width={20}
          height={20}
          className="action mr-1"
        />
        {domain}
      </Link>
    </li>
  );
};

export default function ActionExternalMenu({ links, date, action, platform }) {
  const fireflyWebUrl = (() => {
    if (
      !platform ||
      ![PlatformType.farcaster, PlatformType.lens].includes(platform)
    )
      return null;
    let path = "";
    if (platform === PlatformType.lens) {
      const pathExp = /\/([^\/]+)$/;
      const matches = (
        action.type === ActivityType.share
          ? action.metadata.target_url
          : action.related_urls[0]
      ).match(pathExp);
      if (matches) {
        path = matches[1];
      }
    } else {
      path =
        action.type === ActivityType.share
          ? action.metadata.target.publication_id
          : action.metadata.publication_id;
    }

    return `https://firefly.mask.social/post/${path}?source=${platform}`;
  })();

  return (
    <>
      <div
        className={`btn btn-sm btn-link btn-action dropdown-toggle`}
        tabIndex={0}
      >
        <SVG
          src="../icons/icon-more.svg"
          width={16}
          height={16}
          className="action"
          style={{ transform: "rotate(90deg)" }}
        />
      </div>
      <ul className="menu">
        <li className="menu-item dropdown-menu-item">
          <div>{new Date(date * 1000).toLocaleString()}</div>
        </li>
        <li className="divider" data-content="LINKS"></li>
        {fireflyWebUrl && (
          <li key={fireflyWebUrl} className="menu-item dropdown-menu-item">
            <Link prefetch={false} href={fireflyWebUrl} target="_blank">
              <SVG
                src="../icons/icon-open.svg"
                width={20}
                height={20}
                className="action mr-1"
              />
              Firefly Web
            </Link>
          </li>
        )}
        {links?.filter(Boolean).map((x) => (
          <ExternalLink key={x} url={x} />
        ))}
      </ul>
    </>
  );
}
