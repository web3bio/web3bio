"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "../../../../components/shared/Loading";
import Modal from "../../../../components/shared/Modal";
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
  return null;
}
