"use client";
import { Loading } from "../../../../components/shared/Loading";
import Modal from "../../../../components/shared/Modal";
export default function LoadingPage() {
  return (
    <Modal>
      <div className="global-loading">
        <Loading />
        <p className="mt-4">Loading data from Web3.bio...</p>
      </div>
    </Modal>
  );
}
