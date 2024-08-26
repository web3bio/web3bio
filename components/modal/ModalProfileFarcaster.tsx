import { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { Avatar } from "../shared/Avatar";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { useProfiles } from "../hooks/useReduxProfiles";
import { useQuery } from "@apollo/client";
import { QUERY_FARCASTER_STATS } from "../utils/queries";
import { FIREFLY_ENDPOINT, ProfileFetcher } from "../utils/api";

export default function FarcasterProfile(props) {
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

  const socialCapital = useMemo(
    () => airstack?.Socials?.Social?.[0],
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
          className="modal-header"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(
              PlatformType.farcaster
            )?.color,
          }}
        >
          <div className="modal-cover farcaster"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.farcaster)?.icon}`}
              fill="#fff"
              width={14}
              height={14}
            />
          </div>
          <span className="modal-header-title">Farcaster Profile</span>
        </div>
        <div className="modal-body">
          <Avatar
            width={80}
            height={80}
            className="avatar"
            alt={handle}
            src={_profile?.avatar}
            identity={handle}
          />
          <div className="d-flex mt-2" style={{ alignItems: "center", lineHeight: 1.25 }}>
            <strong className="h4 text-bold">{_profile.displayName}</strong>
            {socialCapital?.isFarcasterPowerUser ? (
              <div
                className="active-badge c-auto"
                title="Power User of Farcaster"
              >
                ϟ
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="text-gray mt-1 mb-2">
            @{_profile.identity}
            <span> · </span>
            <span title="Farcaster FID">#{fid || "…"}</span>
          </div>
          <div className="mt-2 mb-2">
            <strong className="text-large">
              {_profile.social.following.toLocaleString()}
            </strong>{" "}
            Following ·{" "}
            <strong className="text-large">
              {_profile.social.follower.toLocaleString()}
            </strong>{" "}
            Followers
          </div>
          <div className="mt-2">{_profile.description}</div>
          {_profile.location && <div className="mt-2 mb-2">
            📍 {_profile.location}
          </div>}
          {socialCapital?.socialCapital && (
            <div className="mt-4 mb-2">
              <div className="feed-token">
                <span className="text-large">🪪</span>
                <span className="feed-token-value">
                  Social Capital Score
                </span>
                <span className="feed-token-value text-bold">
                  {Number(
                    socialCapital?.socialCapital.socialCapitalScore
                  ).toFixed(2)}
                </span>
              </div>
              {" "}
              <div className="feed-token">
                <span className="text-large">🏅</span>
                <span className="feed-token-value">
                  Social Rank
                </span>
                <span className="feed-token-value text-bold">
                  {socialCapital?.socialCapital.socialCapitalRank}
                </span>
              </div>
            </div>
          )}

          {channelsData?.data?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-section">
                <div className="panel-section-title">Active Channels</div>
                <div className="panel-section-content">
                  {channelsData.data.map((x) => {
                    return (
                      <Link
                        key={x.id}
                        href={`https://warpcast.com/~/channel/${x.id}`}
                        className="list-item"
                        target="_blank"
                      >
                        <Image
                          alt={x.name}
                          width={40}
                          height={40}
                          src={x.image_url}
                          className="list-item-icon"
                        />
                        <div className="list-item-body">
                          <div className="list-item-title">
                            <strong>{x.name}</strong>{" "}
                            <span className="text-gray">/{x.id}</span>
                          </div>
                          <div className="list-item-subtitle">
                            {x.description}
                          </div>
                          <div className="list-item-subtitle text-gray">
                            {x.follower_count?.toLocaleString()} followers
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
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
                fill="#fff"
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
