import Link from "next/link";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
export const domainRegexp =
  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;

export default function ActionExternalMenu({ links, action }) {
  const fireflyWebUrl = [PlatformType.farcaster, PlatformType.lens].includes(
    action?.platform?.toLowerCase()
  )
    ? `https://firefly.mask.social/post/${
        action.metadata.publication_id
      }?source=${action.platform.toLowerCase()}`
    : null;
  return (
    <>
      <div
        className={`btn btn-sm btn-link ${links?.length && "dropdown-toggle"}`}
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
