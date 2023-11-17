"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Modal from "../../../../components/modal/Modal";
import { Loading } from "../../../../components/shared/Loading";
import useModal from "../../../../hooks/useModal";

export default function LoadingPage() {
  const pathname = usePathname();
  const { modalType } = useModal();
  useEffect(() => {
    const newPathname = pathname.replaceAll("/profile", "");
    window.history.replaceState(null, "", newPathname);
  }, [pathname]);

  return (
    <Modal modalType={modalType}>
      <div className="global-loading">
        <Loading />
      </div>
    </Modal>
  );
}
