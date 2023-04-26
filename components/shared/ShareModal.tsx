import { useState } from "react";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";

const shareMap = [
  {
    icon: "icons/icon-twitter.svg",
    shareURL: (url, text) =>
      `https://twitter.com/share?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
    text: "Twitter",
  },
  //   {
  //     icon: "icons/icon-instagram.svg",
  //     url: "",
  //     text: "Instagram",
  //   },
  //   {
  //     icon: "icons/icon-email.svg",
  //     url: "",
  //     text: "E-mail",
  //   },
  {
    icon: "icons/icon-telegram.svg",
    shareURL: (url, text) =>
      `https://telegram.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
    text: "Telegram",
  },
  { key: "copy", icon: "icons/icon-share.svg", url: "", text: "Copy" },
];

export default function ShareModal(props) {
  const { onClose } = props;
  const handleShareItemClick = (item) => {
    window.open(item.shareURL(window.location.href, item.text));
  };
  const [copied, setCopied] = useState(null);
  const onCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };
  return (
    <div className="web3bio-mask-cover" onClick={onClose}>
      <div
        className="share-modal-wrapper"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <h5>Share link to Web3.bio</h5>
        <div className="share-item-box">
          {shareMap.map((x) => {
            return x.key === "copy" ? (
              <Clipboard
                component="div"
                className="btn share-item"
                key={`share_${x.text}`}
                data-clipboard-text={window.location.href}
                onSuccess={onCopySuccess}
              >
                <SVG src={x.icon} height={24} width={24} />
                {copied && <div className="tooltip-copy">COPIED</div>}
              </Clipboard>
            ) : (
              <div
                key={`share_${x.text}`}
                className="btn share-item"
                onClick={() => handleShareItemClick(x)}
              >
                <SVG src={x.icon} height={24} width={24} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
