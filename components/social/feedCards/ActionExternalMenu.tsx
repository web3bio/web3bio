import Link from "next/link";
import SVG from "react-inlinesvg";
const domainRegexp = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;

export default function ActionExternalMenu({ links }) {
  return (
    <>
      <div
        className={`btn btn-sm ${links?.length && "dropdown-toggle"}`}
        tabIndex={0}
      >
        <SVG
          src="../icons/icon-more.svg"
          width={14}
          height={14}
          className="action"
          style={{ transform: "rotate(90deg)" }}
        />
      </div>
      <ul className="menu">
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
