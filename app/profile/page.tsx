"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Loading } from "../../components/shared/Loading";
import useSWR from "swr";
import { ProfileFetcher } from "../../components/apis/profile";
import WalletProfileMain from "../../components/manage/WalletProfileMain";

export default function WalletProfilePage() {
  const { address } = useAccount();
  const [authed, setAuthed] = useState(false);
  const [text, setText] = useState("Querying authorization status...");
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    authed
      ? process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/profile/${address}`
      : null,
    ProfileFetcher
  );

  useEffect(() => {
    if (!address) {
      setText("Unauthorized, redirecting to home page");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setAuthed(true);
      if (isLoading) {
        setText("Fetching data from Web3.bio...");
      }
    }
  }, [address, router, isLoading]);

  return (
    <>
      {!authed || isLoading ? (
        <div className="web3-profile container grid-xl global-loading">
          <Loading />
          <p className="mt-4">{text}</p>
        </div>
      ) : (
        <WalletProfileMain data={data} />
      )}
    </>
  );
}
