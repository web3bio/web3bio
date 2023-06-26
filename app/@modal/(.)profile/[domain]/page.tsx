"use client";
import useSWR from "swr";
import { Loading } from "../../../../components/shared/Loading";
import { Error } from "../../../../components/shared/Error";
import Modal from "../../../../components/shared/Modal";
import ProfileMain from "../../../../components/profile/ProfileMain";
import { _fetcher } from "../../../../components/apis/ens";
import { handleSearchPlatform } from "../../../../utils/utils";
import { useRouter } from "next/navigation";

function useProfile(identity: string, platform: string, fallbackData) {
  const url =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT +
    `/profile/${platform.toLowerCase()}/${identity}`;
  const { data, error } = useSWR<any>(url, _fetcher, {
    fallbackData: fallbackData,
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function ProfileModal({ params, searchParams }) {
  const { domain } = params;
  const platform = handleSearchPlatform(domain);
  const { isLoading, isError, data } = useProfile(domain, platform, null);
  const router = useRouter();
  return (
    <Modal onDismiss={() => router.back()}>
      {isLoading ? (
        <Loading
          styles={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
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
  );
}
