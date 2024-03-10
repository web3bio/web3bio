"use client";
import React, { useState } from "react";
import Link from "next/link";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, formatText, colorMod } from "../../utils/utils";
import { Error } from "../shared/Error";
import { Avatar } from "../shared/Avatar";
import useModal, { ModalType } from "../../hooks/useModal";
import Modal from "../modal/Modal";
import { useRouter } from "next/navigation";
import WalletButton from "../shared/WalletButton";
import WidgetDomainManagement from "./WidgetDomainManagement";

export default function WalletProfileMain(props) {
  const { data, domain } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [curProfile, setCurProfile] = useState(data?.[0] || data);
  const { isOpen, modalType, closeModal, openModal, params } = useModal();
  const router = useRouter();

  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

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

  const avatarProfile = curProfile?.avatar
    ? curProfile
    : data?.find((x) => x.avatar);
  const pageTitle =
    curProfile.identity == curProfile.displayName
      ? `${curProfile.displayName}`
      : `${curProfile.displayName} (${curProfile.identity})`;
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
                alt={`${pageTitle} Profile Photo`}
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
            <h1 className="text-assistive">{`${pageTitle} ${
              SocialPlatformMapping(curProfile.platform).label
            } Web3 Profile`}</h1>
            <h2 className="text-assistive">{`Explore ${pageTitle} Web3 identity profiles, social links, NFT collections, Web3 activities, dWebsites, POAPs etc on the Web3.bio profile page.`}</h2>
            <div className="profile-name">{curProfile.displayName}</div>
            <h3 className="text-assistive">{`${pageTitle}‘s wallet address is ${curProfile.address}`}</h3>
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
                className="profile-share btn btn-sm ml-2"
                title="Share this profile"
                onClick={() =>
                  openModal(ModalType.share, {
                    profile: curProfile,
                    path: `${curProfile.identity}`,
                    avatar: avatarProfile.avatar,
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
                    ["--badge-bg-color" as string]:
                      colorMod(
                        SocialPlatformMapping(curProfile.platform).color,
                        5
                      ) || "rgba(#000, .04)",
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
        </div>
        <div className="column col-8 col-md-12">
          <WidgetDomainManagement setCurProfile={setCurProfile} data={data} />
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
      {isOpen && (
        <Modal params={params} onDismiss={closeModal} modalType={modalType} />
      )}
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
