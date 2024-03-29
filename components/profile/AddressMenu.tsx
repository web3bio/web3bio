import Link from "next/link";
import SVG from "react-inlinesvg";
import { generateVCardData } from "../../utils/vcard";
import { NetworkMapping } from "../../utils/utils";
import { NetworkData } from "../../utils/network";

const createDownloadLink = (data, filename) => {
  var blob = new Blob([data], { type: "text/vcard" });

  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;

  return link;
};
export const downloadVCard = (_profile) => {
  const vCardData = generateVCardData(_profile);
  const downloadLink = createDownloadLink(
    vCardData,
    `${_profile.identity}.vcard`
  );
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
export default function AddressMenu({ profile }) {
  const network =
    profile.platform === NetworkData.solana.key
      ? profile.platform
      : NetworkData.ethereum.key;
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
        {
          profile.platform !== NetworkData.solana.key && 
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
        }
        <li className="menu-item dropdown-menu-item">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              downloadVCard(profile);
            }}
          >
            <SVG
              src="../icons/icon-open.svg"
              width={20}
              height={20}
              className="action mr-1"
            />
            Download Profile vCard
          </Link>
        </li>
      </ul>
    </>
  );
}
