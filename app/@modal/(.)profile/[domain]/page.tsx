"use client";
import useSWR from "swr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { _fetcher } from "../../../../components/apis/ens";
import { handleSearchPlatform, mapLinks } from "../../../../utils/utils";
import { PlatformType } from "../../../../utils/platform";
import { Loading } from "../../../../components/shared/Loading";
import { Error } from "../../../../components/shared/Error";
import ProfileMain from "../../../../components/profile/ProfileMain";
import Modal from "../../../../components/shared/Modal";
import { isArray } from "@apollo/client/utilities";

interface ProfileData {
  platform: PlatformType;
  identity: string;
  name: string;
  bio: string;
  error?: string;
}
interface UseProfileProps {
  identity: string;
  fallbackData?: ProfileData[];
}

function useProfile({ identity, fallbackData }: UseProfileProps) {
  const url = `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${identity}`;

  const { data, error, isValidating } = useSWR(url, _fetcher, {
    revalidateOnFocus: false,
  });
  return {
    data,
    isLoading: isValidating || (!data && !error),
    isError: error,
  };
}

function findProfileData(
  domain: string,
  data: ProfileData[] | undefined,
  platform: PlatformType
) {
  if (!domain || !data) return null;
  if (!isArray(data)) return data as any;
  const profiles = (data as ProfileData[]).filter(
    (x) => x.platform === platform
  );
  return profiles.length > 0 ? profiles[0] : data[0];
}

export default function ProfileModal({
  params: { domain },
}: {
  params: { domain: string };
}) {
  const platform = handleSearchPlatform(domain);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const pathname = usePathname();
  const { data, isLoading, isError } = useProfile({
    identity: domain,
  });
  const router = useRouter();
  useEffect(() => {
    const newPathname = pathname.replaceAll("/profile", "");
    window.history.replaceState(null, "", newPathname);
    setProfileData(findProfileData(domain, data, platform));
  }, [domain, data, platform]);

  const renderModalContent = () => {
    if (isLoading || !profileData) {
      return (
        <div className="global-loading">
          <Loading />
        </div>
      );
    }

    if (isError || profileData.error) {
      return <Error msg={profileData.error ?? ""} />;
    }

    return (
      <ProfileMain
        data={{
          ...profileData,
          links: mapLinks(data || []),
        }}
        relations={
          data?.map((x) => ({ platform: x.platform, identity: x.identity })) ||
          []
        }
        platform={platform}
      />
    );
  };
  return <Modal onDismiss={() => router.back()}>{renderModalContent()}</Modal>;
}
