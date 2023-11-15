import { useCallback, useRef, useEffect } from "react";

import SVG from "react-inlinesvg";
import { ModalType } from "../../hooks/useModal";
import MediaModalContent from "./MediaModalContent";
import NFTModalContentRender from "./NFTModalContent";
import PoapsModalContent from "./PoapsModalContent";
import ShareModalContent from "./ShareModalContent";

export default function Modal(props) {
  const { onDismiss, children, modalType, params } = props;
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const onClick = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onDismiss();
      e.stopPropagation();
    },
    [onDismiss]
  );
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const renderContent = (children, params) => {
    switch (modalType) {
      case ModalType.common:
        return children;
      case ModalType.nft:
        return <NFTModalContentRender asset={params} onClose={onDismiss} />;
      case ModalType.poaps:
        return <PoapsModalContent asset={params} onClose={onDismiss} />;
      case ModalType.share:
        return <ShareModalContent {...params} onClose={onDismiss} />;
      case ModalType.media:
        return <MediaModalContent {...params} onClose={onDismiss} />;
      default:
        return children;
    }
  };
  return (
    <div ref={overlay} className="web3bio-mask-cover" onClick={onClick}>
      <div
        ref={wrapper}
        className={`web3bio-modal-container ${
          modalType === ModalType.share ? "web3bio-share-container" : ""
        }`}
        style={{
          background: [ModalType.common, ModalType.share].includes(modalType)
            ? "#fff"
            : "transparent",
        }}
      >
        {modalType !== ModalType.share && (
          <div className="btn btn-close modal-close-icon" onClick={onDismiss}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
        )}
        {renderContent(children, params)}
      </div>
    </div>
  );
}
