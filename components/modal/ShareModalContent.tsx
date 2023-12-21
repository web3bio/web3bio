import { useState } from "react";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

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
    action: "Share on Twitter",
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
    action: "Share via Telegram",
  },
];

export default function ShareModalContent(props) {
  const {profile, path, onClose, avatar} = props;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio"}${path}`;
  const [isCopied, setIsCopied] = useState(false);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const relativeOGURL =
    window.location.origin +
    `/api/og/?path=${path}&address=${profile?.address}&avatar=${avatar}&displayName=${profile?.displayName}`;
  return (
    <>
      <div className="profile-share-header">
        <div className="h5">Share this profile</div>
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <div className="profile-share-body">
        <div className="profile-card mb-4">
          <NFTAssetPlayer
            className="img-responsive"
            src={relativeOGURL}
            type={"image/png"}
            width="100%"
            height="auto"
            placeholder={true}
            alt={profile.identity}
            style={{ height: 240 }}
          />
        </div>

        <div className="btn-group btn-group-block">
          {shareMap.map((x) => (
            <a
              key={x.platform}
              className="btn btn-lg share-item"
              href={x.shareURL(url, profile.displayName)}
              target="_blank"
            >
              <SVG fill="#000" src={x.icon} height={20} width={20} />
              {x.action}
            </a>
          ))}
        </div>
      </div>

      <div className="profile-share-footer">
        <div className="input-group">
          <input
            type="text"
            className="form-input input-lg"
            value={url}
            readOnly
            onFocus={(e) => e.target.select()}
          />
          <Clipboard
            component="div"
            className="btn btn-primary btn-lg input-group-btn"
            key="share_copy"
            data-clipboard-text={url}
            onSuccess={onCopySuccess}
          >
            <SVG src="icons/icon-copy.svg" height={24} width={24} /> COPY
          </Clipboard>
        </div>
      </div>

      {isCopied && (
        <div className="web3bio-toast">
          <div className="toast">Copied to clipboard</div>
        </div>
      )}
    </>
  );
}
