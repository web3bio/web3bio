import Link from "next/link";
import { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { createVCardString, fetchAndConvertToBase64 } from "../../utils/vcard";
import _ from "lodash";
import { PlatformType } from "../../utils/platform";

export default function AddressMenu({ profile }) {
  const [avatarBase64, setAvatarBase64] = useState("");

  useEffect(() => {
    const fetchAvatarBase64 = async () => {
      fetchAndConvertToBase64(profile.avatar).then((base64) =>
        setAvatarBase64((base64 as string) || "")
      );
    };
    if (profile.avatar) {
      fetchAvatarBase64();
    }
  }, [profile]);
  const createDownloadLink = (data, filename) => {
    var blob = new Blob([data], { type: "text/vcard" });

    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    return link;
  };
  const downloadVCard = () => {
    const vCardData = createVCardString({
      FN: profile.displayName,
      EMAIL: profile.email || "",
      URL:
        _.find(
          profile.links,
          (x) =>
            x.platform === PlatformType.website ||
            x.platform === PlatformType.url
        )?.link || "",
      NOTE: profile.description || "",
      ["PHOTO"]: avatarBase64 || "",
    });
    const downloadLink = createDownloadLink(
      vCardData,
      `${profile.displayName}.vcf`
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
          style={{ transform: "rotate(90deg)" }}
        />
      </div>
      <ul className="menu">
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://etherscan.io/address/${profile.address}`}
            target="_blank"
          >
            View on Etherscan
          </Link>
        </li>
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://hoot.it/search/${profile.address}/activities`}
            target="_blank"
          >
            View activities on Hoot
          </Link>
        </li>
        <li className="menu-item dropdown-menu-item">
          <Link
            href={`https://debank.com/profile/${profile.address}`}
            target="_blank"
          >
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
            Export Profile vCard
          </Link>
        </li>
      </ul>
    </>
  );
}
