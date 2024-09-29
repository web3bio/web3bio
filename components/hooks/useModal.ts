import { useState } from "react";

export enum ModalType {
  nft = "nft",
  poaps = "poaps",
  media = "media",
  share = "share",
  common = "common",
  article = "article",
  philand = "philand",
  search = "search",
  graph = "graph",
  profile = "profile",
  tip = "tip",
  guild = "guild",
  snapshot = "snapshot",
  gitcoin = "gitcoin",
  degenscore = "degenscore",
  talent = "talent",
  efp = "efp",
}

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  params: any | null;
}

const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: ModalType.common,
    params: null,
  });

  const openModal = (type: ModalType, params: any) => {
    document.body.style.overflowY = "hidden";
    setModalState({ isOpen: true, type, params });
  };

  const closeModal = () => {
    document.body.style.overflowY = "auto";
    setModalState({ isOpen: false, type: ModalType.common, params: null });
  };

  return {
    ...modalState,
    openModal,
    closeModal,
  };
};

export default useModal;
