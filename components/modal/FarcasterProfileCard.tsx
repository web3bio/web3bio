import SVG from "react-inlinesvg";
import useSWR from "swr";
import { warpcastFetcher } from "../apis/farcaster";
import { Loading } from "../shared/Loading";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
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
    warpcastFetcher,
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
    warpcastFetcher
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
  return isLoading || !data ? (
    <>
      <div className="modal-profile-header" style={{
        ["--widget-primary-color" as string]: SocialPlatformMapping(
          PlatformType.farcaster
        )?.color
      }}>
        <div className="modal-profile-cover farcaster"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.farcaster)?.icon}`}
            width={14}
            height={14}
          />
        </div>
        <span>Farcaster Profile</span>
      </div>
      <div className="modal-profile-body">
        <Loading />
      </div>
    </>
  ) : (
    <>
      <div className="modal-profile-header" style={{
        ["--widget-primary-color" as string]: SocialPlatformMapping(
          PlatformType.farcaster
        )?.color
      }}>
        <div className="modal-profile-cover farcaster"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.farcaster)?.icon}`}
            width={14}
            height={14}
          />
        </div>
        <span>Farcaster Profile</span>
        <span>{" "}·{" "}</span>
        <span title="Farcaster FID">#{" "}{fid}</span>
      </div>
      <div className="modal-profile-body">
        <Avatar
          width={80}
          className="avatar"
          alt={handle}
          src={avatar}
          identity={handle}
        />
        <div className="d-flex mt-4" style={{alignItems: "center"}}>
          <strong className="h4 text-bold">{data.result.user.displayName}</strong>
          {data.result.user.activeOnFcNetwork ? <div className="active-badge" title="Power User of Farcaster">ϟ</div> : ""}
        </div>
        <div className="text-gray">
          @{data.result.user.username}
        </div>
        <div className="mt-2">
          {data.result.user.profile.bio.text}
        </div>
        <div className="mt-2">
          {data.result.user.profile.location.description ? `📍 ${data.result.user.profile.location.description}` : ""}
        </div>
        <div className="mt-2 mb-4">
          <strong className="text-large">{data.result.user.followingCount.toLocaleString()}</strong> Following
          {" "}·{" "}
          <strong className="text-large">{data.result.user.followerCount.toLocaleString()}</strong> Followers
        </div>
        <div className="divider"></div>
        {channelsData.length > 0 && (
          <div className="panel-widget">
            <div className="panel-widget-title">
              Hosting Channels
            </div>
            <div className="panel-widget-content">
              {channelsData.map((x) => {
                return (
                  <Link key={x.key} href={x.url} className="channel-item" target="_blank">
                    <Image alt={x.name} width={40} height={40} src={x.imageUrl} className="channel-item-icon" />
                    <div className="channel-item-body">
                      <div className="channel-item-title"><strong>{x.name}</strong> <span className="text-gray">/{x.id}</span></div>
                      <div className="channel-item-title">{x.description}</div>
                      <div className="channel-item-subtitle text-gray">{x.followerCount.toLocaleString()} followers</div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {hasNextPage && (
              <div ref={albumRef}>{isValidating && <Loading />}</div>
            )}
          </div>
        )}
      </div>
      <div className="modal-profile-footer">
        <div className="btn-group btn-group-block">
          <Link href={link} target="_blank" className="btn">
            <SVG src={"icons/icon-open.svg"} width={20} height={20} />
            Open in Warpcast
          </Link>
          <Link href={`https://firefly.mask.social/profile/${fid}?source=farcaster`} target="_blank" className="btn btn-primary">
            <SVG src={"icons/icon-firefly.svg"} width={20} height={20} className="mr-1" />
            Open in Firefly
          </Link>
        </div>
      </div>
    </>
  );
}
