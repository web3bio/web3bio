import { Suspense } from "react";
import LoadingPage from "./loading";

export default function DomainLayout({ children }) {
  return (
    <div className="web3-profile container grid-xl">
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </div>
  );
}

export const runtime = "edge";
export const revalidate = 432000;
