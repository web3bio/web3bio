import { useCallback, useRef, useEffect } from "react";
import { ModalType } from "../hooks/useModal";
import ArticleModalContent from "./ModalArticle";
import MediaModalContent from "./ModalMedia";
import NFTModalContentRender from "./ModalNFT";
// import PhilandModalContent from "./ModalPhiland";
import PoapsModalContent from "./ModalPoaps";
import SearchModalContent from "./ModalSearch";
import ShareModalContent from "./ModalShare";
import IdentityGraphModalContent from "./ModalIdentityGraph";
import ProfileModalContent from "./ModalProfile";

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
      case ModalType.share:
        return <ShareModalContent {...params} onClose={onDismiss} />;
      case ModalType.nft:
        return <NFTModalContentRender asset={params} onClose={onDismiss} />;
      case ModalType.poaps:
        return <PoapsModalContent asset={params} onClose={onDismiss} />;
      // case ModalType.philand:
      //   return <PhilandModalContent {...params} onClose={onDismiss} />;
      case ModalType.media:
        return <MediaModalContent {...params} onClose={onDismiss} />;
      case ModalType.search:
        return <SearchModalContent {...params} onClose={onDismiss} />;
      case ModalType.graph:
        return (
          <IdentityGraphModalContent
            containerRef={wrapper}
            {...params}
            onClose={onDismiss}
          />
        );
      case ModalType.profile:
        return <ProfileModalContent identity={params} onClose={onDismiss} />;
      case ModalType.article:
        return <ArticleModalContent {...params} onClose={onDismiss} />;
      default:
        return children;
    }
  };
  return (
    <div ref={overlay} className="web3bio-modal-cover" onClick={onClick}>
      <div
        ref={wrapper}
        className={`web3bio-modal-container modal-${modalType}-container`}
      >
        {renderContent(children, params)}
      </div>
    </div>
  );
}
