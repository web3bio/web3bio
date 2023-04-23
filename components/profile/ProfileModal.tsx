import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";
import Modal from "../shared/Modal";
import ProfileMain from "./ProfileMain";
import useSWR from "swr";
import { _fetcher } from "../apis/ens";
import { LinksItem } from "../../utils/api";

export function useProfile(identity: string, platform: string) {
  const host = window.location.origin || "https://staging.web5.bio";
  const url = host + `/api/profile/${platform.toLowerCase()}/${identity}`;
  const { data, error } = useSWR<any>(url, _fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function ProfileModal(props) {
  const { identity, platform, onClose } = props;
  const { isLoading, isError, data } = useProfile(identity, platform);

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
            linksData: Object.entries(data?.links || {}).map(([key, value]) => {
              return {
                platform: key,
                ...(value as LinksItem),
              };
            }),
          }}
          platform={platform}
        />
      )}
    </Modal>
  );
}
