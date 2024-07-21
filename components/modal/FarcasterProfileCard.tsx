import { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { Avatar } from "../shared/Avatar";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { FIREFLY_ENDPOINT } from "../apis/firefly";
import { ProfileFetcher } from "../apis/profile";
import { useProfiles } from "../hooks/useReduxProfiles";
import { useQuery } from "@apollo/client";
import { QUERY_FARCASTER_STATS } from "../apis/airstack";

export default function FarcasterProfileCard(props) {
  const { handle } = props;
  const [fid, setFid] = useState(null);

  const profiles = useProfiles();

  const { data: airstack } = useQuery(QUERY_FARCASTER_STATS, {
    variables: {
      name: handle,
    },
    context: {
      clientName: "airstack",
    },
  });

  const isPowerUser = useMemo(
    () => airstack?.Socials?.Social?.[0]?.isFarcasterPowerUser,
    [airstack]
  );
  const { data: channelsData } = useSWR(
    fid
      ? FIREFLY_ENDPOINT + `/v2/farcaster-hub/active_channels?fid=${fid}`
      : null,
    ProfileFetcher
  );
  const _profile = useMemo(() => {
    return profiles?.find(
      (x) => x.platform === PlatformType.farcaster && x.identity === handle
    );
  }, [profiles, handle]);

  useEffect(() => {
    if (_profile.social.uid) {
      setFid(_profile.social.uid);
    }
  }, [_profile]);
  return (
    _profile && (
      <>
        <div
          className="modal-profile-header"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(
              PlatformType.farcaster
            )?.color,
          }}
        >
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
          <Avatar
            width={80}
            height={80}
            className="avatar"
            alt={handle}
            src={_profile?.avatar}
            identity={handle}
          />
          <div className="d-flex mt-2" style={{ alignItems: "center" }}>
            <strong className="h4 text-bold">{_profile.displayName}</strong>
            {isPowerUser ? (
              <div className="active-badge" title="Power User of Farcaster">
                ϟ
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="text-gray">@{_profile.identity}<span> · </span><span title="Farcaster FID">#{fid || "…"}</span></div>
          <div className="mt-2">{_profile.description}</div>
          <div className="mt-2">
            {(_profile.location && `📍 ${_profile.location}`) || ""}
          </div>
          <div className="mt-2 mb-4">
            <strong className="text-large">
              {_profile.social.following.toLocaleString()}
            </strong>{" "}
            Following ·{" "}
            <strong className="text-large">
              {_profile.social.follower.toLocaleString()}
            </strong>{" "}
            Followers
          </div>
          <div className="divider"></div>
          {channelsData?.data?.length > 0 && (
            <div className="panel-widget">
              <div className="panel-widget-title">Active Channels</div>
              <div className="panel-widget-content">
                {channelsData.data.map((x) => {
                  return (
                    <Link
                      key={x.id}
                      href={`https://warpcast.com/~/channel/${x.id}`}
                      className="channel-item"
                      target="_blank"
                    >
                      <Image
                        alt={x.name}
                        width={40}
                        height={40}
                        src={x.image_url}
                        className="channel-item-icon"
                      />
                      <div className="channel-item-body">
                        <div className="channel-item-title">
                          <strong>{x.name}</strong>{" "}
                          <span className="text-gray">/{x.id}</span>
                        </div>
                        <div className="channel-item-subtitle">
                          {x.description}
                        </div>
                        <div className="channel-item-subtitle text-gray">
                          {x.follower_count?.toLocaleString()} followers
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="modal-profile-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://warpcast.com/${handle}`}
              target="_blank"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in Warpcast
            </Link>
            <Link
              href={`https://firefly.mask.social/profile/${fid}?source=farcaster`}
              target="_blank"
              className="btn btn-primary"
            >
              <SVG
                src={"icons/icon-firefly.svg"}
                width={20}
                height={20}
                className="mr-1"
              />
              Open in Firefly
            </Link>
          </div>
        </div>
      </>
    )
  );
}
