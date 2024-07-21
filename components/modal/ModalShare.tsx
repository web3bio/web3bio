import { useState } from "react";
import Image from "next/image";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { downloadVCard } from "../utils/vcard";

const shareMap = [
  {
    platform: "twitter",
    icon: "icons/icon-twitter.svg",
    shareURL: (url, name) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(
        `Hey! Check out and explore ${name}'s Web3 profile. `
      )}&via=web3bio`,
    action: "Twitter",
  },
  {
    platform: "telegram",
    icon: "icons/icon-telegram.svg",
    shareURL: (url, name) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(
        `Hey! Check out and explore ${name}'s Web3 profile. `
      )}`,
    action: "Telegram",
  },
  {
    platform: "warpcast",
    icon: "icons/icon-farcaster.svg",
    shareURL: (url, name) =>
      `https://warpcast.com/~/compose?embeds[]=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(
        `Hey! Check out and explore ${name}'s Web3 profile. `
      )}`,
    action: "Warpcast",
  },
];

export default function ShareModalContent(props) {
  const { profile, path, onClose, avatar } = props;
  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio"
  }/${path}`;
  const [isCopied, setIsCopied] = useState(false);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const params = new URLSearchParams();
  if (path) params.append("path", path);
  if (profile) params.append("address", profile.address);
  params.append("displayName", profile.displayName);
  if (avatar) params.append("avatar", avatar);
  if (profile.description) params.append("description", profile.description);
  const relativeOGURL = params.toString()
    ? `/api/og?${params.toString()}`
    : "/api/og";

  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <div className="profile-share-header">
        <div className="h5">Share this profile</div>
      </div>
      <div className="profile-share-body">
        <div
          className="profile-share-card mb-4"
          onClick={(e) => {
            e.preventDefault();
            downloadVCard(profile);
          }}
        >
          <Image
            className="img-responsive"
            src={`${relativeOGURL}`}
            width={0}
            height={0}
            alt={profile.identity}
            style={{ height: "auto", width: "100%", aspectRatio: "40 / 21" }}
          />
        </div>
      </div>
      <div className="profile-share-actions">
        Share on
        <div className="btn-group">
          {shareMap.map((x) => (
            <a
              key={x.platform}
              className="btn share-item"
              href={x.shareURL(url, profile.displayName)}
              target="_blank"
            >
              <SVG fill="#121212" src={x.icon} height={18} width={18} />
              {x.action}
            </a>
          ))}
        </div>
      </div>

      <div className="profile-share-footer">
        <div className="input-group">
          <input
            type="text"
            className="form-input"
            value={url}
            readOnly
            onFocus={(e) => e.target.select()}
          />
          <Clipboard
            component="div"
            className="btn input-group-btn"
            key="share_copy"
            data-clipboard-text={url}
            onSuccess={onCopySuccess}
          >
            <SVG
              src={
                isCopied ? "../icons/icon-check.svg" : "../icons/icon-copy.svg"
              }
              width={20}
              height={20}
              className="action"
            />
            Copy
          </Clipboard>
        </div>
        <div className="divider mt-4 mb-4"></div>
        <div
          className="btn btn-block"
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
        </div>
      </div>

      {isCopied && (
        <div className="web3bio-toast">
          <div className="toast">
            <SVG
              src="../icons/icon-copy.svg"
              width={24}
              height={24}
              className="action mr-2"
            />
            Copied to clipboard
          </div>
        </div>
      )}
    </>
  );
}
