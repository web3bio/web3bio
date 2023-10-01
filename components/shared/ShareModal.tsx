import { useState } from "react";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { WEB3BIO_OG_ENDPOINT } from "../../utils/utils";
import Image from "next/image";

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

export default function ShareModal(props) {
  const { profile, url, onClose } = props;
  const [isCopied, setIsCopied] = useState(false);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <div className="web3bio-mask-cover" onClick={onClose}>
      <div
        className="web3bio-modal-container web3bio-share-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="profile-share-header">
          <div className="h5">Share this profile</div>
          <div className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
        </div>
        <div className="profile-share-body">
          <div className="profile-card">
            <Image
              className="img-responsive"
              src={WEB3BIO_OG_ENDPOINT + `api/${profile.identity}`}
              alt={profile.identity}
              height={630}
              width={1200}
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
      </div>
    </div>
  );
}
