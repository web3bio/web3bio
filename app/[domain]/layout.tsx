import { Suspense } from "react";
import ProfileLoading from "../../components/profile/ProfileLoading";

export default function DomainLayout({ children }) {
  return (
    // todo: open to active the loading state
    <Suspense fallback={<ProfileLoading />}>
      <div className="web3-profile container grid-xl">{children}</div>
    </Suspense>
  );
}

export const runtime = "edge";
export const revalidate = 432000;