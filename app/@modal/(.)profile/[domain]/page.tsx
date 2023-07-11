"use client";
import useSWR from "swr";
import { Loading } from "../../../../components/shared/Loading";
import { Error } from "../../../../components/shared/Error";
import ProfileMain from "../../../../components/profile/ProfileMain";
import { _fetcher } from "../../../../components/apis/ens";
import { handleSearchPlatform } from "../../../../utils/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { PlatformType } from "../../../../utils/platform";

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

export default function ProfileModal({ params, searchParams }) {
  const { domain } = params;
  const platform = handleSearchPlatform(domain);
  const { data, isLoading, isError } = useProfile(domain, platform, null);
  const pathName = usePathname();

  useEffect(() => {
    const newPathName = pathName.replaceAll("/profile", "");
    window.history.replaceState(null, "", newPathName);
  }, []);
  return isLoading ? (
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
  );
}
