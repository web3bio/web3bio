"use client";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { _fetcher } from "../../../components/apis/ens";
import { handleSearchPlatform, mapLinks } from "../../../utils/utils";
import { usePathname } from "next/navigation";
import { PlatformType } from "../../../utils/platform";
import { Loading } from "../../../components/shared/Loading";
import { Error } from "../../../components/shared/Error";
import ProfileMain from "../../../components/profile/ProfileMain";
import Modal from "../../../components/shared/Modal";

interface ProfileData {
  platform: PlatformType;
  identity: string;
  name: string;
  bio: string;
}
interface UseProfileProps {
  shouldFetch?: boolean;
  identity: string;
  fallbackData?: ProfileData[];
}

function useProfile({ shouldFetch, identity, fallbackData }: UseProfileProps) {
  const url = shouldFetch
    ? `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${identity}`
    : null;

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
  const profiles = data.filter((x) => x.platform === platform);
  return profiles.length > 0 ? profiles[0] : data[0];
}

export default function ProfileModal() {
  const pathName = usePathname();
  const domain = pathName.replace("/", "");
  const platform = handleSearchPlatform(domain);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const shouldFetch =
    !!domain &&
    [
      PlatformType.ens,
      PlatformType.lens,
      PlatformType.farcaster,
      PlatformType.nextid,
    ].includes(platform);
  const { data, isLoading, isError } = useProfile({
    shouldFetch,
    identity: domain,
  });
  const router = useRouter();

  useEffect(() => {
    setProfileData(findProfileData(domain, data, platform));
  }, [domain, data, platform]);

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <div className="global-loading">
          <Loading />
        </div>
      );
    }

    if (isError) {
      return <Error />;
    }

    if (!profileData) {
      return null;
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
  return shouldFetch ? (
    <Modal onDismiss={() => router.back()}>{renderModalContent()}</Modal>
  ) : null;
}
