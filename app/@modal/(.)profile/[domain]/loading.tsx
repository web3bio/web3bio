"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Modal from "../../../../components/modal/Modal";
import { Loading } from "../../../../components/shared/Loading";

export default function LoadingPage() {
  const pathname = usePathname();
  useEffect(() => {
    const newPathname = pathname.replaceAll("/profile", "");
    window.history.replaceState(null, "", newPathname);
  }, [pathname]);

  return (
    <Modal>
      <div className="global-loading">
        <Loading />
      </div>
    </Modal>
  );
}
