import SVG from "react-inlinesvg";
import { Loading } from "../shared/Loading";
import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import { useQuery } from "@apollo/client";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { GET_PROFILE_LENS, LensInterestsMapping } from "../utils/lens";

export default function LensProfileCard(props) {
  const { handle, avatar } = props;
  const { data, loading, error } = useQuery(GET_PROFILE_LENS, {
    variables: {
      request: { forHandle: "lens/" + handle.replace(".lens", "") },
    },
    context: {
      clientName: "lens",
    },
  });
  const profileLocation = data?.profile?.metadata?.attributes?.find((x) => x.key === "location")?.value || "";

  return loading || !data?.profile ? (
    <>
      <div className="modal-profile-header" style={{
        ["--widget-primary-color" as string]: SocialPlatformMapping(
          PlatformType.lens
        )?.color
      }}>
        <div className="modal-profile-cover lens"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.lens)?.icon}`}
            width={14}
            height={14}
          />
        </div>
        <span>Lens Profile</span>
      </div>
      <div className="modal-profile-body">
        <Loading />
      </div>
    </>
  ) : (
    <>
      <div className="modal-profile-header" style={{
        ["--widget-primary-color" as string]: SocialPlatformMapping(
          PlatformType.lens
        )?.color
      }}>
        <div className="modal-profile-cover lens"></div>
        <div className="platform-icon">
          <SVG
            src={`../${SocialPlatformMapping(PlatformType.lens)?.icon}`}
            width={14}
            height={14}
          />
        </div>
        <span>Lens Profile</span>
        <span>{" "}·{" "}</span>
        <span title="Lens UID">#{" "}{parseInt(data.profile.id, 16)}</span>
      </div>
      <div className="modal-profile-body">
        <Avatar
          width={80}
          height={80}
          className="avatar"
          alt={handle}
          src={avatar}
          identity={handle}
        />
        <div className="d-flex mt-4" style={{alignItems: "center"}}>
          <strong className="h4 text-bold">{data.profile.metadata.displayName}</strong>
          {data.profile.onchainIdentity.proofOfHumanity && <div className="profile-badge" title="Proof of Humanity">Proof of Humanity</div>}
          {data.profile.onchainIdentity.worldcoin.isHuman && <div className="profile-badge" title="Worldcoin Verified Human">Worldcoin Verified</div>}
        </div>
        <div className="text-gray">
          @{data.profile.handle.localName}
        </div>
        <div className="mt-2">
          {data.profile.metadata.bio}
        </div>
        <div className="mt-2">
          {profileLocation ? `📍 ${profileLocation}` : ""}
        </div>
        <div className="mt-2 mb-4">
          <strong className="text-large">{data.profile.stats.following.toLocaleString()}</strong> Following
          {" "}·{" "}
          <strong className="text-large">{data.profile.stats.followers.toLocaleString()}</strong> Followers
        </div>
        <div className="divider"></div>
        <div className="panel-widget">
          <div className="panel-widget-title">
            Stats
          </div>
          <div className="panel-widget-content">
            <strong className="text-large">{data.profile.stats.posts}</strong> Posts
            {" "}·{" "}
            <strong className="text-large">{data.profile.stats.comments}</strong> Comments
            {" "}·{" "}
            <strong className="text-large">{data.profile.stats.mirrors}</strong> Mirrors
            {" "}·{" "}
            <strong className="text-large">{data.profile.stats.publications}</strong> Publications
            {" "}·{" "}
            <strong className="text-large">{data.profile.stats.quotes}</strong> Quotes
          </div>
        </div>
        
        <div className="divider"></div>
        {data.profile.interests.length > 0 && (
          <div className="panel-widget">
            <div className="panel-widget-title">
              Interests
            </div>
            <div className="panel-widget-content">
              <div className="profile-interests">
                {data.profile.interests.map((x) => {
                  const interestItem = LensInterestsMapping(x);
                  return (
                    <div className={`interest-item label ${x.split("__")[0].toLowerCase()}`} key={x}>
                      {interestItem?.label || x}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="modal-profile-footer">
        <div className="btn-group btn-group-block">
          <Link href={`https://hey.xyz/u/${handle}`} target="_blank" className="btn">
            <SVG src={"icons/icon-open.svg"} width={20} height={20} />
            Open in Hey
          </Link>
          <Link href={`https://firefly.mask.social/profile/${handle}?source=lens`} target="_blank" className="btn btn-primary">
            <SVG src={"icons/icon-firefly.svg"} width={20} height={20} className="mr-1" />
            Open in Firefly
          </Link>
        </div>
      </div>
    </>
  );
}
