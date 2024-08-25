import Link from "next/link";
import { useCallback, useEffect } from "react";
import SVG from "react-inlinesvg";
import useModal, { ModalType } from "../hooks/useModal";
import Modal from "../modal/Modal";

export default function ProfileFooter({openModal}) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openModal(ModalType.search, {});
    }
  }, [openModal]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSearchClick = useCallback(() => openModal(ModalType.search, {}), [openModal]);

  return (
    <>
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
        <button
          className={"btn btn-search"}
          title="Try it out – press ⌘+K (macOS) or CTRL+K (Windows) to search Web3 identities"
          onClick={() =>
            openModal(ModalType.search, {})
          }
        >
          <SVG
            src="icons/icon-search.svg"
            width={24}
            height={24}
            className="icon"
          />
        </button>
        <div className="text-assistive">
          <Link
            href="/sitemaps"
            className="btn-link text-dark ml-2 mr-2"
            title="Web3.bio Sitemaps"
          >
            Web3.bio Sitemaps
          </Link>
        </div>
      </div>
    </>
  );
}
