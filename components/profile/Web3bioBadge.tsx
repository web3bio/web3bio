import Link from "next/link";
import { useEffect } from "react";
import SVG from "react-inlinesvg";
import useModal, { ModalType } from "../../hooks/useModal";
import Modal from "../modal/Modal";

export default function Web3bioBadge(props) {
  const { domain } = props;
  const { isOpen, modalType, openModal, params, closeModal } = useModal();

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey && e.keyCode === 75) || (e.metaKey && e.keyCode === 75)) {
        if (isOpen) {
          closeModal();
        } else {
          openModal(ModalType.search, {
            domain,
          });
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);
  return (
    <>
      {isOpen && (
        <Modal params={params} onDismiss={closeModal} modalType={modalType} />
      )}
      <div className="web3bio-badge">
        <Link
          href="/?utm_source=profile"
          prefetch={false}
          target="_parent"
          className="btn btn-primary"
          title="Web3.bio - Web3 Identity Graph Search and Link in Bio Profile"
        >
          <div className="badge-emoji mr-1">🖖</div>Made with{" "}
          <strong className="text-pride animated-pride ml-1">Web3.bio</strong>
        </Link>
        <div
          className={"btn btn-primary btn-search"}
          onClick={() =>
            openModal(ModalType.search, {
              domain,
            })
          }
        >
          <SVG
            src="icons/icon-search.svg"
            width={24}
            height={24}
            className="icon"
          />
        </div>
      </div>
    </>
  );
}
