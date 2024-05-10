import SVG from "react-inlinesvg";
import useSWR from "swr";
import { waprcastFetcher } from "../apis/farcaster";
import { Loading } from "../shared/Loading";
import { useEffect, useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";
import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import Image from "next/image";

export default function FarcasterProfileCard(props) {
  const { handle, link, avatar } = props;
  const [fid, setFid] = useState(null);
  const { data, isLoading, error } = useSWR(
    handle ? `v2/user-by-username?username=${handle}` : null,
    waprcastFetcher
  );

  const {
    data: channelsData,
    trigger,
    isMutating,
  } = useSWRMutation(
    `v1/user-following-channels?fid=${fid}&limit=${20}`,
    waprcastFetcher,
    {}
  );

  useEffect(() => {
    if (data?.result?.user?.fid) {
      setFid(data.result.user.fid);
    }
    if (fid) {
      trigger();
    }
  }, [data, fid, trigger]);
  const hostingChannels = useMemo(() => {
    if (channelsData?.result?.channels && fid) {
      return channelsData.result.channels.reduce((pre, cur) => {
        if (cur.hostFids.includes(fid)) {
          pre.push(cur);
        }
        return pre;
      }, []);
    }
    return [];
  }, [channelsData, fid]);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="modal-profile-header">
        <div className="modal-profile-id">#{fid}</div>
        <Link href={link} target="_blank" className="btn btn-action">
          <SVG src={"icons/icon-open.svg"} width={20} height={20} />
        </Link>
      </div>
      <div className="modal-profile-body">
        <Avatar
          width={120}
          className="avatar"
          alt={handle}
          src={avatar}
          identity={handle}
        />
        <div className="modal-profile-follows">
          <div>{data.result.user.followingCount} Following</div> ·{" "}
          <div>{data.result.user.followerCount} Followers</div>
        </div>
        <div className="modal-profile-location">
          {data.result.user.profile.location.description}
        </div>
        <div className="divider"></div>
        <div className="modal-profile-bio">
          {data.result.user.profile.bio.text}
        </div>

        <div>
          Power user badge: {data.result.user.activeOnFcNetwork.toString()}
        </div>
        <div>{data?.result?.user?.bio?.text}</div>
        <div className="modal-profile-channels">
          {isMutating ? (
            <Loading />
          ) : (
            <>
              {hostingChannels.map((x) => {
                return (
                  <div key={x.key} className="channel-item">
                    <Image
                      alt={x.name}
                      width={36}
                      height={36}
                      src={x.imageUrl}
                    />
                    <div className="channel-item-body">
                      <strong>{x.name}</strong>/ {x.id} <br />
                      <span>{x.followerCount} followers </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
