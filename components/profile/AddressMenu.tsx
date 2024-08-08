import { useState } from "react";
import Link from "next/link";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { Network, NetworkMapping } from "../utils/network";

export default function AddressMenu({ profile }) {
  const [isCopied, setIsCopied] = useState(false);

  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const network =
    profile.platform === Network.solana ? profile.platform : Network.ethereum;

  return (
    <>
      <div className="btn btn-sm dropdown-toggle" tabIndex={0}>
        <SVG
          src="../icons/icon-more.svg"
          width={20}
          height={20}
          className="action"
          style={{ transform: "rotate(90deg)" }}
        />
      </div>
      <ul className="menu">
        <li className="menu-item dropdown-menu-item">
          <Clipboard
            component="a"
            button-href="#"
            onClick={(e) => {
              e.preventDefault();
            }}
            data-clipboard-text={profile.address}
            onSuccess={onCopySuccess}
            title="Copy this wallet address"
          >
            <SVG
              src={
                isCopied ? "../icons/icon-check.svg" : "../icons/icon-copy.svg"
              }
              width={20}
              height={20}
              className="action mr-1"
            />
            Copy wallet address
          </Clipboard>
        </li>
        <li className="menu-item dropdown-menu-item">
          <Link
            href={NetworkMapping(network).scanPrefix + profile.address}
            target="_blank"
          >
            <SVG
              src="../icons/icon-search.svg"
              width={20}
              height={20}
              className="action mr-1"
            />
            View on {NetworkMapping(network).scanLabel}
          </Link>
        </li>
        {profile.platform !== Network.solana && (
          <li className="menu-item dropdown-menu-item">
            <Link
              href={`https://debank.com/profile/${profile.address}`}
              target="_blank"
            >
              <SVG
                src="../icons/icon-wallet.svg"
                width={20}
                height={20}
                className="action mr-1"
              />
              View assets on DeBank
            </Link>
          </li>
        )}
      </ul>
    </>
  );
}
