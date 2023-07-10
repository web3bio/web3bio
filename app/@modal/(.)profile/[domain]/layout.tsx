"use client";
import { useRouter } from "next/navigation";
import Modal from "../../../../components/shared/Modal";

export default function ProfileModalLayout({ children }) {
  const router = useRouter();
  return <Modal onDismiss={() => router.back()}>{children}</Modal>;
}
