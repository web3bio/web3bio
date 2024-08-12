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
  talent = 'talent'
}

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.common);
  const [params, setParams] = useState<any>(null);

  const openModal = (modalType, params) => {
    setIsOpen(true);
    setModalType(modalType);
    setParams(params);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(ModalType.common);
  };

  return {
    params,
    isOpen,
    modalType,
    openModal,
    closeModal,
  };
};

export default useModal;
