import SVG from "react-inlinesvg";
import useSWR from "swr";
import { waprcastFetcher } from "../apis/farcaster";
import { Loading } from "../shared/Loading";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import useInfiniteScroll from "react-infinite-scroll-hook";

const processChannelsData = (data, fid) => {
  if (!data?.[0]?.result?.channels) return [];
  const res = [] as any;
  data.forEach((x) => {
    x.result.channels.forEach((i) => {
      if (
        !res.some((j) => j.name === i.name) &&
        (i.hostFids.includes(fid) || i.leadFid === fid)
      ) {
        res.push(i);
      }
    });
  });
  return res.sort((a, b) => b.followerCount - a.followerCount);
};

const getURL = (index, fid, previous) => {
  if (!fid) return null;
  const cursor = previous?.next?.cursor;
  if (index !== 0 && !(previous?.result?.channels?.length || cursor))
    return null;
  return `v1/user-following-channels?fid=${fid}&limit=${50}${
    cursor ? `&cursor=${cursor}` : ""
  }`;
};

const useChannels = ({ fid }) => {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, fid, previous),
    waprcastFetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
    }
  );
  return {
    hasNextPage: !!data?.[data.length - 1]?.next?.cursor,
    data: processChannelsData(data, fid),
    isError: error,
    size,
    isValidating,
    setSize,
  };
};
export default function FarcasterProfileCard(props) {
  const { handle, link, avatar } = props;
  const [fid, setFid] = useState(null);
  const { data, isLoading, error } = useSWR(
    handle ? `v2/user-by-username?username=${handle}` : null,
    waprcastFetcher
  );

  const {
    data: channelsData,
    size,
    setSize,
    isValidating,
    isError,
    hasNextPage,
  } = useChannels({
    fid: fid,
  });
  useEffect(() => {
    if (data?.result?.user?.fid) {
      setFid(data.result.user.fid);
    }
    if (hasNextPage && !isValidating && channelsData.length < 6) {
      setSize(size + 1);
    }
  }, [data, fid, channelsData, isValidating, hasNextPage]);

  const [albumRef] = useInfiniteScroll({
    loading: isValidating,
    disabled: !!isError,
    onLoadMore: () => {
      if (!isValidating && hasNextPage) {
        setSize(size + 1);
      }
    },
    hasNextPage: hasNextPage,
  });
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
          width={150}
          className="avatar"
          alt={handle}
          src={avatar}
          identity={handle}
        />
        <div className="modal-profile-name">
          <strong>{data.result.user.displayName} </strong>/
          <span>{data.result.user.username}</span>
        </div>
        <div className="modal-profile-follows">
          <div>{data.result.user.followingCount.toLocaleString()} Following</div> ·{" "}
          <div>{data.result.user.followerCount.toLocaleString()} Followers</div>
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
          {channelsData.map((x) => {
            return (
              <div key={x.key} className="channel-item">
                <Image alt={x.name} width={36} height={36} src={x.imageUrl} />
                <div className="channel-item-body">
                  <strong>{x.name}</strong>/ {x.id} <br />
                  <span>{x.followerCount.toLocaleString()} followers </span>
                </div>
              </div>
            );
          })}
          {hasNextPage && (
            <div ref={albumRef}>{isValidating && <Loading />}</div>
          )}
          {!hasNextPage && !isValidating && channelsData?.length > 0 && (
            <div className="channels-number">
              Total Hosting Channels: {channelsData.length}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
