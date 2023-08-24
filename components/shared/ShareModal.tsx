import { useState } from "react";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { QRCode } from "react-qrcode-logo";
import Image from "next/image";
import { formatText } from "../../utils/utils";

const shareMap = [
  {
    icon: "icons/icon-twitter.svg",
    shareURL: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}&via=web3bio`,
    text: "Twitter",
    action: "Tweet",
  },
  {
    icon: "icons/icon-telegram.svg",
    shareURL: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
    text: "Telegram",
    action: "Telegram",
  }
];

export default function ShareModal(props) {
  const { profile, onClose } = props;
  const handleShareItemClick = (item) => {
    window.open(item.shareURL(window.location.href, item.text));
  };
  const [copied, setCopied] = useState(false);
  const onCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="web3bio-mask-cover" onClick={onClose}>
      <div
        className="web3bio-modal-container web3bio-share-container"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="profile-share-header">
          <div className="h5">Share link to your profile</div>
          <div className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
        </div>
        <div className="profile-share-body">
          <div className="profile-card">
            <div className="card-avatar">
              {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    className="avatar"
                    priority={true}
                    alt="Profile Avatar"
                    height={180}
                    width={180}
                  />
                ) : (
                  <div className="avatar bg-gray"></div>
                )}
            </div>
            <div className="card-content">
              <div className="card-name">{profile.displayName}</div>
              <div className="card-identity">{formatText(profile.address)}</div>
            </div>
          </div>

          <div className="qrcode-container">
            <QRCode 
              value={window.location.href}
              ecLevel="L"
              size={220}
              eyeRadius={50}
              eyeColor="#000"
              fgColor="#222"
            />
          </div>

          <div className="btn-group btn-group-block">
            {shareMap.map((x) => (
              <div
                key={`share_${x.text}`}
                className="btn btn-lg share-item"
                onClick={() => handleShareItemClick(x)}
              >
                <SVG fill="#000" src={x.icon} height={20} width={20} />
                {x.action}
              </div>
            ))}
          </div>
        </div>

        <div className="profile-share-footer">
          <div className="input-group">
            <input type="text" className="form-input input-lg" value={window.location.href} readOnly onFocus={(e) => e.target.select()} />
            <Clipboard
              component="div"
              className="btn btn-primary btn-lg input-group-btn"
              key="share_copy"
              data-clipboard-text={window.location.href}
              onSuccess={onCopySuccess}
            >
              <SVG src="icons/icon-copy.svg" height={24} width={24} /> COPY
              {copied && <div className="tooltip-copy">COPIED</div>}
            </Clipboard>
          </div>
        </div>
      </div>
    </div>
  );
}
