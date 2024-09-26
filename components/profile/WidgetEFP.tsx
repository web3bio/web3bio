import useSWR from "swr";
import { ModalType } from "../hooks/useModal";
import { EFP_ENDPOINT, profileAPIBaseURL, ProfileFetcher } from "../utils/api";
import { useEffect, useState } from "react";
import { Avatar } from "../shared/Avatar";
import { Loading } from "../shared/Loading";

export default function WidgetEFP(props) {
  const { profile, openModal } = props;
  const { data, isLoading, error } = useSWR(
    `${EFP_ENDPOINT}/v1/users/${profile.address}/followers?limit=5`,
    ProfileFetcher
  );

  const [profiles, setProfiles] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const batchFetchProfiles = async () => {
      const requestMap = data.followers?.map((x) => x?.address);
      await Promise.allSettled(
        requestMap
          .filter((x) => !!x)
          .map((x) => {
            const fetchURL = `${profileAPIBaseURL}/ns/ens/${x}`;
            return fetch(fetchURL).then((res) => res.json());
          })
      ).then((responses) => {
        setProfiles(responses.map((x) => (x as any).value));
      });
    };
    if (data?.followers?.length >= 0) {
      batchFetchProfiles();
      setLoading(false);
    }
  }, [data]);

  if (error) return null;

  return loading || isLoading ? (
    <div className="profile-actions">
      <Loading
        styles={{
          margin: "0 1rem",
        }}
      />{" "}
      loading followers powered by efp...
    </div>
  ) : (
    profiles?.length > 0 && (
      <div
        className="profile-actions c-hand"
        onClick={() => {
          openModal(ModalType.efp, {
            profile,
          });
        }}
      >
        <div className="follower-avatars">
          {profiles.map((x) => {
            return (
              <Avatar
                className="avatar-item"
                width={32}
                height={32}
                identity={x.address}
                src={x.avatar}
                alt={x.avatar}
              />
            );
          })}
        </div>
        <div className="follower-text">
          {profiles
            .map((x) => x.identity)
            .join(",")
            .slice(0, 40) +
            "..." +
            " followed " +
            profile.identity}
        </div>
     
      </div>
    )
  );
}
