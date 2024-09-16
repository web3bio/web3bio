import SVG from "react-inlinesvg";
import Link from "next/link";
import {
  PLATFORM_DATA,
  PlatformType,
  SocialPlatformMapping,
} from "../utils/platform";
import Image from "next/image";
import useSWR from "swr";
import { ProfileFetcher } from "../utils/api";
import { useMemo } from "react";
import { PHI_QUESTS_LIST } from "../utils/phiquests";
export default function PhilandModalContent({ data, onClose, profile }) {
  // referer: https://quest.philand.xyz/?status=completed
  const { data: checkStatus } = useSWR(
    `https://utils-api.phi.blue/v1/philand/condition/check?address=${profile.address}`,
    ProfileFetcher
  );

  const claimedQuests = useMemo(() => {
    if (!checkStatus?.result) return [];
    return checkStatus?.result
      .map((x) => {
        const questDetail = PHI_QUESTS_LIST.find((i) => i.tokenId === x);
        if (questDetail) return { ...questDetail };
      })
      .filter((x) => !!x);
  }, [checkStatus]);
  const socialLinks = useMemo(() => {
    if (data?.philandLink?.data?.length === 0) return [];
    return data?.philandLink?.data?.filter((x) => x.url?.length > 0);
  }, [data.philandLink.data]);

  const renderSocialLinks = () => (
    <div className="btn-group mt-2 mb-2">
      {socialLinks.map((x) => {
        if (!x.url) return null;
        const platformKey = x.title.toLowerCase();
        const platformItem =
          PLATFORM_DATA.get(platformKey) ||
          SocialPlatformMapping(PlatformType.website);
        return (
          <Link
            key={x.url + x.title}
            href={x.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
          >
            <SVG
              src={platformItem.icon as string}
              fill="#121212"
              width={18}
              height={18}
            />
            <span>{x.title}</span>
          </Link>
        );
      })}
    </div>
  );
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
          {socialLinks.length > 0 && renderSocialLinks()}
          <div className="mt-4 mb-2">
            <div className="feed-token feed-token-lg">
              <span className="feed-token-emoji">👑</span>
              <span className="feed-token-value">PhiRank</span>
              <span className="feed-token-value text-bold">
                {data.phiRank.data.rank}
              </span>
            </div>
          </div>

          {data.philandImage?.imageurl?.length > 0 && (
            <div className="panel-section">
              <div className="panel-section-title">
                Phi Land
                <div className="divider"></div>
              </div>
              <img
                className="img-responsive"
                src={data.philandImage.imageurl}
                alt=""
              />
            </div>
          )}

          {claimedQuests?.length > 0 && (
            <div className="panel-section">
              <div className="panel-section-title">
                Claimed Quests
                <div className="divider"></div>
              </div>
              <div className="panel-section-content">
                {claimedQuests.map((x) => {
                  return (
                    <Link
                      key={x.tokenId}
                      href={x.questUrl}
                      className="list-item"
                      target="_blank"
                    >
                      <Image
                        alt={x.name}
                        width={40}
                        height={40}
                        src={x.imageUrl}
                        className="list-item-icon"
                      />
                      <div className="list-item-body">
                        <div className="list-item-title">
                          <strong>{x.name}</strong>
                        </div>
                        <div className="list-item-subtitle">
                          {x.activities?.[0]}
                        </div>
                        <div className="list-item-subtitle text-gray">
                          EXP: {x.EXP}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={`https://land.philand.xyz/${profile.identity}?ref=web3.bio`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              View Phi Land
            </Link>
          </div>
        </div>
      </>
    </>
  );
}
