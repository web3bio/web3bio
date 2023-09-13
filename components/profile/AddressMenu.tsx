import Link from "next/link";
import SVG from "react-inlinesvg";
export default function AddressMenu({ address }) {
  return (
    <div className="dropdown">
      <SVG
        tabIndex={0}
        className="action dropdown-toggle"
        src="../icons/icon-more.svg"
        width={20}
        height={20}
      />

      <ul className="menu">
        <li className="menu-item dropdown-menu-item">
          <Link
            href={"https://etherscan.io/address/" + address}
            target="_blank"
          >
            Etherscan
          </Link>
        </li>
      </ul>
    </div>
  );
}
