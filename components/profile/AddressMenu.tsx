import Link from "next/link";
import { useState } from "react";
import SVG from "react-inlinesvg";
export default function AddressMenu({ address }) {
  const [vCardHref,setVCardHref] = useState('')
  return (
    <>
      <div className="btn btn-sm dropdown-toggle" tabIndex={0}>
        <SVG
          src="../icons/icon-more.svg"
          width={20}
          height={20}
          className="action"
          style={{"transform": "rotate(90deg)"}}
        />
      </div>
      <ul className="menu">
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
          >
            View on Etherscan
          </Link>
        </li>
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://hoot.it/search/${address}/activities`}
            target="_blank"
          >
            View activities on Hoot
          </Link>
        </li>
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://debank.com/profile/${address}`}
            target="_blank"
          >
            View assets on DeBank
          </Link>
        </li>
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://debank.com/profile/${address}`}
            target="_blank"
          >
            Export Profile vCard
          </Link>
        </li>
      </ul>
    </>
  );
}
