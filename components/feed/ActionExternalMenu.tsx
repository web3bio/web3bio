import Link from "next/link";
import SVG from "react-inlinesvg";
import { PlatformType } from "../utils/platform";
import { ActivityType } from "../utils/activity";
export const domainRegexp =
  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;

export default function ActionExternalMenu({ links, date, action, platform }) {
  const fireflyWebUrl = (() => {
    const source = platform?.toLowerCase();
    if (
      !source ||
      ![PlatformType.farcaster, PlatformType.lens].includes(source)
    )
      return null;
    let path = "";
    if (source === PlatformType.lens) {
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

    return `https://firefly.mask.social/post/${path}?source=${platform?.toLowerCase()}`;
  })();

  return (
    <>
      <div
        className={`btn btn-sm btn-link btn-action ${links?.length && "dropdown-toggle"}`}
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
          <div>
            {new Date(date * 1000).toLocaleString()}
          </div>
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
        {links?.map((x) => (
          <li key={x} className="menu-item dropdown-menu-item">
            <Link prefetch={false} href={x} target="_blank">
              <SVG
                src="../icons/icon-search.svg"
                width={20}
                height={20}
                className="action mr-1"
              />
              {domainRegexp.exec(x)?.[1]}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
