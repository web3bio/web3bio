"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Loading } from "../../components/shared/Loading";
import useSWR from "swr";
import { ProfileFetcher } from "../../components/apis/profile";
import WalletProfileMain from "../../components/manage/WalletProfileMain";
import { useLazyQuery } from "@apollo/client";
import { PlatformType } from "../../components/utils/platform";
import { GET_PROFILES } from "../../components/utils/queries";

export default function WalletProfilePage() {
  const { address } = useAccount();
  const [authed, setAuthed] = useState(false);
  const [text, setText] = useState("Querying authorization status...");
  const [resolvedData, setResolvedData] = useState([]);
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    authed
      ? process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/profile/${address}`
      : null,
    ProfileFetcher
  );

  const [getQuery, { loading, error: isError, data: profileData }] =
    useLazyQuery(GET_PROFILES, {
      variables: {
        platform: PlatformType.ethereum,
        identity: address?.toLowerCase(),
      },
    });

  useEffect(() => {
    if (!address) {
      setText("Unauthorized, redirecting to home page");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setAuthed(true);
      getQuery();
      if (isLoading) {
        setText("Fetching data from Web3.bio...");
      }
      if (data?.length) {
        setResolvedData(data);
      }
      if (profileData?.identity && data?.length) {
        const _data = JSON.parse(JSON.stringify(data));

        _data?.forEach((i) => {
          const rsItem = profileData.identity.identityGraph.vertices.find(
            (x) =>
              x.identity === i.identity &&
              [PlatformType.dotbit, PlatformType.ens].includes(x.platform)
          );
          if (rsItem) {
            i.expiredAt = rsItem.expiredAt;
          }
        });
        setResolvedData(_data);
      }
    }
  }, [address, router, isLoading, data, getQuery, profileData]);

  return (
    <>
      {!authed || isLoading || !resolvedData?.length ? (
        <div className="web3-profile container grid-xl global-loading">
          <Loading />
          <p className="mt-4">{text}</p>
        </div>
      ) : (
        <WalletProfileMain data={resolvedData} />
      )}
    </>
  );
}
