import React, { useCallback, useRef, useEffect, useMemo } from "react";
import { ModalType } from "../hooks/useModal";
import ArticleModalContent from "./ModalArticle";
import MediaModalContent from "./ModalMedia";
import NFTModalContentRender from "./ModalNFT";
import PoapsModalContent from "./ModalPoaps";
import SearchModalContent from "./ModalSearch";
import ShareModalContent from "./ModalShare";
import IdentityGraphModalContent from "./ModalIdentityGraph";
import ProfileModalContent from "./ModalProfile";
import TipModalContent from "./ModalTip";
import GuildModalContent from "./ModalGuild";
import SnapshotModalContent from "./ModalSnapshot";
import GitcoinModalContent from "./ModalGitcoin";
import DegenscoreModalContent from "./ModalDegenscore";
import TalentModalContent from "./ModalTalent";

const createModalContentMap = () => ({
  [ModalType.share]: ShareModalContent,
  [ModalType.nft]: NFTModalContentRender,
  [ModalType.poaps]: PoapsModalContent,
  [ModalType.media]: MediaModalContent,
  [ModalType.search]: SearchModalContent,
  [ModalType.graph]: IdentityGraphModalContent,
  [ModalType.tip]: TipModalContent,
  [ModalType.guild]: GuildModalContent,
  [ModalType.profile]: ProfileModalContent,
  [ModalType.article]: ArticleModalContent,
  [ModalType.snapshot]: SnapshotModalContent,
  [ModalType.gitcoin]: GitcoinModalContent,
  [ModalType.degenscore]: DegenscoreModalContent,
  [ModalType.talent]: TalentModalContent,
});

export default function Modal(props) {
  const { onDismiss, children, modalType, params } = props;
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const modalContentMap = useMemo(createModalContentMap, []);

  const onClick = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        onDismiss?.();
      }
    },
    [onDismiss]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const renderContent = useCallback(() => {
    const ModalContent = modalContentMap[modalType];
    return ModalContent ? (
      <ModalContent
        containerRef={wrapper}
        {...params}
        onClose={onDismiss}
      />
    ) : (
      children
    );
  }, [modalType, params, onDismiss, children]);

  return (
    <div ref={overlay} className="web3bio-modal-cover" onClick={onClick}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        ref={wrapper}
        className={`modal-container modal-${modalType}-container`}
      >
        {renderContent()}
      </div>
    </div>
  );
}
