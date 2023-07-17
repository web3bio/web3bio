"use client";
import useSWR from "swr";
import { Loading } from "../../../components/shared/Loading";
import { Error } from "../../../components/shared/Error";
import ProfileMain from "../../../components/profile/ProfileMain";
import { _fetcher } from "../../../components/apis/ens";
import { handleSearchPlatform } from "../../../utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlatformType } from "../../../utils/platform";
import Modal from "../../../components/shared/Modal";

function useProfile(identity: string, platform: string, fallbackData) {
  const resolvedIdentity =
    platform === PlatformType.farcaster
      ? identity.replaceAll(".farcaster", "")
      : identity;
  const url =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT +
    `/profile/${platform.toLowerCase()}/${resolvedIdentity}`;
  const { data, error, isValidating } = useSWR<any>(url, _fetcher, {
    fallbackData: fallbackData,
  });
  return {
    data: data,
    isLoading: isValidating,
    isError: error,
  };
}

export default function ProfileModal() {
  const pathName = usePathname();
  const domain = pathName.replace("/", "");
  const platform = handleSearchPlatform(domain);
  const { data, isLoading, isError } = useProfile(domain, platform, null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (pathName.length > 1) setShowModal(true);
    else {
      setShowModal(false);
    }
  }, [pathName]);
  return (
    showModal && (
      <Modal onDismiss={() => router.back()}>
        {isLoading ? (
          <div className="global-loading">
            <Loading />
          </div>
        ) : isError ? (
          <Error />
        ) : (
          <ProfileMain
            data={{
              ...data,
              links: Object.entries(data?.links || {}).map(([key, value]) => {
                return {
                  platform: key,
                  ...(value as any),
                };
              }),
            }}
            platform={platform}
          />
        )}
      </Modal>
    )
  );
}
