"use client";
import { Loading } from "../../components/shared/Loading";
import Modal from "../../components/shared/Modal";
export default function LoadingPage() {
  return (
    <Modal>
      <div className="global-loading">
        <Loading />
      </div>
    </Modal>
  );
}
