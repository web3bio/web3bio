import Link from "next/link";
import SVG from "react-inlinesvg";
const domainRegexp = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;

export default function ActionExternalMenu({ links }) {
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
        {links?.map((x) => (
          <li key={x} className="menu-item dropdown-menu-item">
            <Link href={x} target="_blank">
              {domainRegexp.exec(x)?.[1]}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
