import Link from "next/link";
import SVG from "react-inlinesvg";
import { generateVCardData } from "../../utils/vcard";

export default function AddressMenu({ profile }) {
  const createDownloadLink = (data, filename) => {
    var blob = new Blob([data], { type: "text/vcard" });

    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    return link;
  };
  const downloadVCard = () => {
    const vCardData = generateVCardData(profile);
    const downloadLink = createDownloadLink(
      vCardData,
      `${profile.identity}.vcard`
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <>
      <div className="btn btn-sm dropdown-toggle" tabIndex={0}>
        <SVG
          src="../icons/icon-more.svg"
          width={20}
          height={20}
          className="action"
          style={{transform: "rotate(90deg)",}}
        />
      </div>
      <ul className="menu">
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://etherscan.io/address/${profile.address}`}
            target="_blank"
          >
            <SVG
              src="../icons/icon-search.svg"
              width={20}
              height={20}
              className="action mr-1"
            />
            View on Etherscan
          </Link>
        </li>
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
        <li className="menu-item dropdown-menu-item">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              downloadVCard();
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
