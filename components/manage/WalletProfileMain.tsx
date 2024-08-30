"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { formatText, colorMod } from "../utils/utils";
import { Error } from "../shared/Error";
import { Avatar } from "../shared/Avatar";
import useModal, { ModalType } from "../hooks/useModal";
import Modal from "../modal/Modal";
import { useRouter } from "next/navigation";
import WalletButton from "../shared/WalletButton";
import { DomainAvailableItem } from "../search/DomainAvailabilityItem";

export default function WalletProfileMain(props) {
  const { data, domain } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [curProfile, setCurProfile] = useState(data?.[0] || data);
  const { isOpen, type, closeModal, openModal, params } = useModal();
  const router = useRouter();

  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const avatarProfile = useMemo(() => {
    return curProfile?.avatar ? curProfile : data?.find((x) => x.avatar);
  }, [curProfile, data]);

  if (!curProfile || curProfile.error) {
    return (
      <Error
        buttonText="Back"
        retry={() => router.push("/")}
        msg={`No profile found in ${formatText(
          curProfile?.address
        )}, click Back to home page`}
      />
    );
  }

  return (
    <>
      <div
        className="web3bio-custom"
        style={{
          backgroundImage:
            curProfile.header || curProfile.avatar
              ? `url("${curProfile.header || curProfile.avatar}")`
              : "none",
        }}
      ></div>
      <WalletButton />
      <div className="columns">
        <div className="column col-4 col-md-12">
          <div className="web3-profile-base">
            <div className="profile-avatar">
              <Avatar
                src={curProfile?.avatar}
                identity={domain}
                className="avatar"
                alt={`${curProfile?.identity} Profile Photo`}
              />
              {avatarProfile && (
                <div
                  className="profile-avatar-badge"
                  style={{ opacity: 1, visibility: "visible" }}
                >
                  <SVG
                    fill={SocialPlatformMapping(curProfile.platform).color}
                    width={20}
                    src={SocialPlatformMapping(curProfile.platform).icon || ""}
                    title={`Fallback avatar from ${
                      SocialPlatformMapping(curProfile.platform).label
                    }`}
                  />
                </div>
              )}
            </div>
            <div className="profile-name">{curProfile.displayName}</div>
            <div className="profile-identity">
              <div className="btn-group dropdown">
                <Clipboard
                  component="div"
                  className="btn btn-sm"
                  data-clipboard-text={curProfile.address}
                  onSuccess={onCopySuccess}
                  title="Copy this wallet address"
                >
                  <SVG
                    src="../icons/icon-wallet.svg"
                    width={20}
                    height={20}
                    className="action-gray"
                  />
                  <span className="profile-label ml-1 mr-1">
                    {formatText(curProfile.address)}
                  </span>
                </Clipboard>
                <Clipboard
                  component="div"
                  className="btn btn-sm"
                  data-clipboard-text={curProfile.address}
                  onSuccess={onCopySuccess}
                  title="Copy this wallet address"
                >
                  <SVG
                    src="../icons/icon-copy.svg"
                    width={20}
                    height={20}
                    className="action"
                  />
                </Clipboard>
              </div>

              <button
                className="profile-share btn btn-sm"
                title="Share this profile"
                onClick={() =>
                  openModal(ModalType.share, {
                    profile: curProfile,
                    path: `${curProfile.identity}`,
                  })
                }
              >
                <SVG src="icons/icon-share.svg" width={20} height={20} />
                Share
              </button>
            </div>

            <div className="profile-badges">
              {curProfile === PlatformType.nextid && (
                <Clipboard
                  component="div"
                  className={`platform-badge nextid active c-hand`}
                  data-clipboard-text={domain}
                  onSuccess={onCopySuccess}
                  title="Copy the Next.ID address"
                  style={{
                    ["--badge-primary-color" as string]:
                      SocialPlatformMapping(curProfile.platform).color ||
                      "#000",
                    ["--badge-bg-color" as string]: colorMod(
                      SocialPlatformMapping(curProfile.platform).color,
                      5
                    ),
                  }}
                >
                  <div className="platform-badge-icon">
                    <SVG
                      fill={SocialPlatformMapping(curProfile.platform).color}
                      width={20}
                      src={
                        SocialPlatformMapping(curProfile.platform).icon || ""
                      }
                    />
                  </div>
                  <span className="platform-badge-name">
                    {formatText(domain)}
                  </span>
                </Clipboard>
              )}
            </div>

            {curProfile.description && (
              <h2 className="profile-description">{curProfile.description}</h2>
            )}
            {curProfile.location && (
              <div className="profile-location">
                <span style={{ fontSize: "20px", marginRight: "5px" }}>📍</span>{" "}
                {curProfile.location}
              </div>
            )}
            {curProfile.email && (
              <div className="profile-email">
                <span style={{ fontSize: "20px", marginRight: "5px" }}>✉️</span>
                <a href={`mailto:${curProfile.email}`}>{curProfile.email}</a>
              </div>
            )}
          </div>
          <div className="dashboard-menu menu">
            <Link target="_blank" href="/" className="menu-item">
              <SVG src="/icons/icon-search.svg" width={28} height={28} />
              Search
            </Link>
            <Link href={`/${curProfile.identity}`} className="menu-item">
              <SVG src="/icons/icon-view.svg" width={28} height={28} />
              Profile
            </Link>
            <Link href={""} className="menu-item">
              <SVG src="/icons/icon-wallet.svg" width={28} height={28} />
              Wallet
            </Link>
            <Link
              target={"_blank"}
              href="https://api.web3.bio"
              className="menu-item"
            >
              <SVG src="/icons/icon-open.svg" width={28} height={28} />
              API
            </Link>
          </div>
        </div>
        <div className="column col-8 col-md-12">
          <div className="domain-list search-result">
            {data?.map((x) => {
              const item = {
                name: x.identity,
                status: "taken",
                platform: x.platform,
                expiredAt: x.expiredAt,
              };
              return (
                <DomainAvailableItem
                  onClick={() => setCurProfile(x)}
                  hideStatus
                  data={item}
                  key={item.name + item.platform}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="web3bio-badge">
        <Link
          href="/?utm_source=profile"
          prefetch={false}
          target="_parent"
          className="btn btn-primary"
          title="Web3.bio - Web3 Identity Graph Search and Link in Bio Profile"
        >
          <div className="badge-emoji mr-2">👋</div>Made with{" "}
          <strong className="text-pride animated-pride ml-1">Web3.bio</strong>
        </Link>
      </div>
      {isOpen && <Modal params={params} onDismiss={closeModal} type={type} />}
      {isCopied && (
        <div className="web3bio-toast">
          <div className="toast">
            <SVG
              src="../icons/icon-copy.svg"
              width={24}
              height={24}
              className="action mr-2"
            />
            Copied to clipboard
          </div>
        </div>
      )}
    </>
  );
}
