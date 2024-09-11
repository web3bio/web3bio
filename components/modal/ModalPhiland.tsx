import SVG from "react-inlinesvg";
import Link from "next/link";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import Image from "next/image";
export default function PhilandModalContent({ data, onClose, profile }) {
  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <>
        <div
          className="modal-header"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(
              PlatformType.philand
            ).color,
          }}
        >
          <div className="modal-cover philand"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.philand).icon}`}
              fill="#fff"
              width={14}
              height={14}
            />
          </div>
          <span className="modal-header-title">Phi Land</span>
        </div>
        <div className="modal-body">
          {profile?.avatar && (
            <Image
              width={80}
              height={80}
              className="avatar avatar-xl"
              alt={profile.identity}
              src={profile?.avatar}
            />
          )}
          <div
            className="d-flex mt-2"
            style={{ alignItems: "center", lineHeight: 1.25 }}
          >
            <strong className="h4 text-bold">{profile.displayName}</strong>
          </div>
          <div className="text-gray mt-1 mb-2">{profile.identity}</div>
          <div className="mt-2 mb-2">{profile?.description}</div>
          <div className="mt-4 mb-2">
            <div className="feed-token feed-token-lg">
              <span className="feed-token-emoji">🏝️</span>
              <span className="feed-token-value">Phi Rank</span>
              <span className="feed-token-value text-bold">
                {data.phiRank.data.rank} # {data.phiRank.data.tokenid}
              </span>
            </div>
          </div>

          <img
            className="img-responsive"
            src={data.philandImage.imageurl}
            alt=""
          />

          <div className="panel-section">
            <div className="panel-section-title">
              Claimed Quests
              <div className="divider"></div>
            </div>
            {/* <div className="panel-section-content">
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
                </div> */}
          </div>
        </div>
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={"https://land.philand.xyz/" + profile.identity}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in Phi Land
            </Link>
          </div>
        </div>
      </>
    </>
  );
}
