import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import Modal from "../shared/Modal";
import ProfileMain from "./ProfileMain";
import useSWR from "swr";
import { _fetcher } from "../apis/ens";

export function useProfile(identity: string, platform: string, fallbackData) {
  const url =
    process.env.NEXT_PUBLIC_PROFILE_END_POINT +
    `/profile/${platform.toLowerCase()}/${identity}`;
  const { data, error } = useSWR<any>(url, _fetcher, {
    fallbackData: fallbackData,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function ProfileModal(props) {
  const { profile, onClose } = props;
  const { isLoading, isError, data } = useProfile(
    profile?.identity,
    profile?.platform,
    profile?.profile
  );
  return (
    <Modal onDismiss={onClose}>
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
          platform={profile?.platform}
        />
      )}
    </Modal>
  );
}
