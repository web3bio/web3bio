"use client";
import useSWR from "swr";
import { Loading } from "../../../components/shared/Loading";
import { Error } from "../../../components/shared/Error";
import ProfileMain from "../../../components/profile/ProfileMain";
import { _fetcher } from "../../../components/apis/ens";
import { handleSearchPlatform, mapLinks } from "../../../utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlatformType } from "../../../utils/platform";
import Modal from "../../../components/shared/Modal";

function useProfile(
  shouldFetch: boolean,
  identity: string,
  platform: string,
  fallbackData
) {
  const resolvedIdentity =
    platform === PlatformType.farcaster
      ? identity.replaceAll(".farcaster", "")
      : identity;
  const url = shouldFetch
    ? process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/profile/${resolvedIdentity}`
    : null;
  const { data, error, isValidating } = useSWR(url, _fetcher, {
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
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading, isError } = useProfile(
    showModal &&
      [PlatformType.ens, PlatformType.lens, PlatformType.farcaster].includes(
        platform
      ),
    domain,
    platform,
    null
  );
  const router = useRouter();
  useEffect(() => {
    if (pathName.length > 1) setShowModal(true);
    else {
      setShowModal(false);
    }
  }, [pathName]);
  return (
    (showModal && data && (
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
              ...(data?.find((x) => x.platform === platform) || data?.[0]),
              links: mapLinks(data),
            }}
            platform={platform}
          />
        )}
      </Modal>
    )) ||
    null
  );
}
