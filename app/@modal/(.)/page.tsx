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

function useProfile(shouldFetch: boolean, identity: string, fallbackData) {
  const url = shouldFetch
    ? process.env.NEXT_PUBLIC_PROFILE_END_POINT + `/profile/${identity}`
    : null;
  const { data, error, isValidating } = useSWR(url, _fetcher, {
    fallbackData: fallbackData,
  });
  return {
    data: data,
    isLoading: isValidating || (!data && !error),
    isError: error,
  };
}

export default function ProfileModal() {
  const pathName = usePathname();
  const domain = pathName.replace("/", "");
  const platform = handleSearchPlatform(domain);
  const [profileData, setProfileData] = useState(null);
  const { data, isLoading, isError } = useProfile(
    !!domain &&
      [PlatformType.ens, PlatformType.lens, PlatformType.farcaster,PlatformType.nextid].includes(
        platform
      ),
    domain,
    null
  );
  const router = useRouter();
  useEffect(() => {
    if (domain && data?.length > 0) {
      setProfileData(data?.find((x) => x.platform === platform) || data?.[0]);
    } else {
      setProfileData(null);
    }
  }, [domain, data, platform]);
  return (
    (profileData && (
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
            relations={Array.from(
              data?.map((x) => ({
                platform: x.platform,
                identity: x.identity,
              }))
            )}
            platform={platform}
          />
        )}
      </Modal>
    )) ||
    null
  );
}
