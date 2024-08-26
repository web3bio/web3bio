import SVG from "react-inlinesvg";
import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import { useQuery } from "@apollo/client";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { GET_PROFILE_LENS, LensInterestsMapping } from "../utils/lens";
import { useProfiles } from "../hooks/useReduxProfiles";
import { useMemo } from "react";

export default function LensProfile(props) {
  const { handle } = props;
  const { data } = useQuery(GET_PROFILE_LENS, {
    variables: {
      request: { forHandle: "lens/" + handle },
    },
    context: {
      clientName: "lens",
    },
  });
  const profiles = useProfiles();
  const _profile = useMemo(() => {
    return profiles?.find(
      (x) => x.platform === PlatformType.lens && x.identity === `${handle}.lens`
    );
  }, [profiles, handle]);
  return (
    _profile && (
      <>
        <div
          className="modal-header"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(
              PlatformType.lens
            )?.color,
          }}
        >
          <div className="modal-cover lens"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.lens)?.icon}`}
              fill="#fff"
              width={14}
              height={14}
            />
          </div>
          <span className="modal-header-title">Lens Profile</span>
        </div>
        <div className="modal-body">
          <Avatar
            width={80}
            height={80}
            className="avatar"
            alt={handle}
            src={_profile.avatar}
            identity={handle}
          />
          <div className="d-flex mt-2" style={{ alignItems: "center", lineHeight: 1.25 }}>
            <strong className="h4 text-bold">{_profile.displayName}</strong>
            {data?.profile?.onchainIdentity?.proofOfHumanity && (
              <div className="profile-badge" title="Proof of Humanity">
                Proof of Humanity
              </div>
            )}
            {data?.profile?.onchainIdentity?.worldcoin?.isHuman && (
              <div className="profile-badge" title="Worldcoin Verified Human">
                Worldcoin Verified
              </div>
            )}
          </div>
          <div className="text-gray mt-1 mb-2">
            @{_profile.identity.replace(".lens", "")}
            <span> · </span>
            <span title="Lens UID">#{_profile.social.uid}</span>
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
          <div className="mt-2 mb-2">
            {_profile.location ? `📍 ${_profile.location}` : ""}
          </div>
          
          <div className="divider mt-4 mb-4"></div>
          <div className="panel-section">
            <div className="panel-section-title">Stats</div>
            <div className="panel-section-content">
              <div className="content">
                <strong className="text-large">
                  {data?.profile?.stats?.posts.toLocaleString() || "…"}
                </strong>{" "}
                Posts ·{" "}
                <strong className="text-large">
                  {data?.profile?.stats?.comments.toLocaleString() || "…"}
                </strong>{" "}
                Comments ·{" "}
                <strong className="text-large">
                  {data?.profile?.stats?.mirrors.toLocaleString() || "…"}
                </strong>{" "}
                Mirrors ·{" "}
                <strong className="text-large">
                  {data?.profile?.stats?.publications.toLocaleString() || "…"}
                </strong>{" "}
                Publications ·{" "}
                <strong className="text-large">
                  {data?.profile?.stats?.quotes.toLocaleString() || "…"}
                </strong>{" "}
                Quotes
              </div>
            </div>
          </div>

          <div className="divider"></div>
          {data?.profile?.interests?.length > 0 && (
            <div className="panel-section">
              <div className="panel-section-title">Interests</div>
              <div className="panel-section-content">
                <div className="profile-interests">
                  {data?.profile?.interests?.map((x) => {
                    const interestItem = LensInterestsMapping(x);
                    return (
                      <div
                        className={`interest-item label ${x
                          .split("__")[0]
                          .toLowerCase()}`}
                        key={x}
                      >
                        {interestItem?.label || x}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://hey.xyz/u/${handle}`}
              target="_blank"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in Hey
            </Link>
            <Link
              href={`https://firefly.mask.social/profile/${handle}?source=lens`}
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
