"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping, formatText, colorMod } from "../../utils/utils";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { RenderWidgetItem } from "./WidgetLinkItem";
import { WidgetNFT } from "./WidgetNFT";
import { WidgetRSS } from "./WidgetRSS";
import { WidgetPOAP } from "./WidgetPoap";
import { WidgetDegenScore } from "./WidgetDegenScore";
import { WidgetFeed } from "./WidgetFeed";
import AddressMenu from "./AddressMenu";
import { Avatar } from "../shared/Avatar";
import useModal, { ModalType } from "../../hooks/useModal";
import Modal from "../modal/Modal";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { WidgetState } from "../../state/widgets/reducer";

export default function ProfileMain(props) {
  const { data, pageTitle, platform, nfts, fromServer, relations, domain } =
    props;
  const [isCopied, setIsCopied] = useState(false);
  const { isOpen, modalType, closeModal, openModal, params } = useModal();
  const pathName = usePathname();
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
  const profileWidgetStates = useSelector<AppState, WidgetState>(
    (state) => state.widgets
  );
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const isEmptyProfile = useCallback(() => {
    const source = Object.values(profileWidgetStates).map((x) => x.isEmpty);
    return (
      source.some((x) => x !== null) &&
      source.filter((x) => x !== null && x === false).length === 0
    );
  }, [profileWidgetStates])();

  if (!data || data.error) {
    return (
      <Error
        retry={() => window.location.reload()}
        msg={data.error || "Error"}
      />
    );
  }
  return (
    <>
      <div
        className="web3bio-custom"
        style={{
          backgroundImage:
            data.header || data.avatar
              ? `url("${data.header || data.avatar}")`
              : "none",
        }}
      ></div>
      <div className="columns">
        <div className="column col-4 col-md-12">
          <div className="web3-profile-base">
            <div className="profile-avatar">
              <Avatar
                src={data?.avatar}
                identity={data?.identity}
                className="avatar"
                alt={`${pageTitle} Profile Photo`}
                height={180}
                width={180}
              />
            </div>
            <h1 className="text-assistive">{`${pageTitle} ${
              SocialPlatformMapping(platform).label
            } Web3 Profile`}</h1>
            <h2 className="text-assistive">{`Explore ${pageTitle} Web3 identity profiles, social links, NFT collections, Web3 activities, dWebsites, POAPs etc on the Web3.bio profile page.`}</h2>
            <div className="profile-name">{data.displayName}</div>
            <h3 className="text-assistive">{`${pageTitle}‘s wallet address is ${data.address}`}</h3>
            <div className="profile-identity">
              <div className="btn-group dropdown">
                <Clipboard
                  component="div"
                  className="btn btn-sm"
                  data-clipboard-text={data.address}
                  onSuccess={onCopySuccess}
                  title="Copy the wallet address"
                >
                  <span className="profile-label ml-1 mr-1">
                    {formatText(data.address)}
                  </span>
                  <SVG
                    src="../icons/icon-copy.svg"
                    width={20}
                    height={20}
                    className="action"
                  />
                </Clipboard>
                <AddressMenu profile={data} />
              </div>
              <button
                className="profile-share btn btn-sm ml-2"
                title="Share this profile"
                onClick={() =>
                  openModal(ModalType.share, {
                    profile: data,
                    url: `${baseURL}${pathName?.replace("profile/", "")}`,
                  })
                }
              >
                <SVG src="icons/icon-share.svg" width={20} height={20} />
                Share
              </button>
            </div>

            <div className="profile-badges">
              {platform === PlatformType.nextid && (
                <Clipboard
                  component="div"
                  className={`platform-badge nextid active c-hand`}
                  data-clipboard-text={domain}
                  onSuccess={onCopySuccess}
                  title="Copy the Next.ID address"
                  style={{
                    ["--badge-primary-color" as string]:
                      SocialPlatformMapping(platform).color || "#000",
                    ["--badge-bg-color" as string]:
                      colorMod(SocialPlatformMapping(platform)?.color, 5) ||
                      "rgba(#000, .04)",
                  }}
                >
                  <div className="platform-badge-icon">
                    <SVG
                      fill={SocialPlatformMapping(platform).color}
                      width={20}
                      src={SocialPlatformMapping(platform).icon || ""}
                    />
                  </div>
                  <span className="platform-badge-name">
                    {formatText(domain)}
                  </span>
                </Clipboard>
              )}
              {relations?.map((x, idx) => {
                const relatedPath = `${x.identity}${
                  x.platform === PlatformType.farcaster ? ".farcaster" : ""
                }`;
                return (
                  <Link
                    href={`/${relatedPath}`}
                    key={x.platform + idx}
                    className={`platform-badge ${x.platform}${
                      idx === 0 ? " active" : ""
                    }`}
                    title={`${pageTitle} ${
                      SocialPlatformMapping(x.platform).label
                    }`}
                    style={{
                      ["--badge-primary-color" as string]:
                        SocialPlatformMapping(x.platform).color || "#000",
                      ["--badge-bg-color" as string]:
                        colorMod(
                          SocialPlatformMapping(x.platform)?.color,
                          10
                        ) || "rgba(#000, .04)",
                    }}
                  >
                    <div className="platform-badge-icon">
                      <SVG
                        fill={SocialPlatformMapping(x.platform).color}
                        width={20}
                        src={SocialPlatformMapping(x.platform).icon || ""}
                      />
                    </div>
                    <span className="platform-badge-name">
                      {x.platform === PlatformType.ethereum ? formatText(x.identity) : x.identity}
                    </span>
                  </Link>
                );
              })}
            </div>

            {data.description && (
              <h2 className="profile-description">{data.description}</h2>
            )}
            {data.location && (
              <div className="profile-location">
                <span style={{ fontSize: "20px", marginRight: "5px" }}>📍</span>{" "}
                {data.location}
              </div>
            )}
            {data.email && (
              <div className="profile-email">
                <span style={{ fontSize: "20px", marginRight: "5px" }}>✉️</span>
                <a href={`mailto:${data.email}`}>{data.email}</a>
              </div>
            )}
          </div>
        </div>
        <div className="column col-8 col-md-12">
          <div className="web3-section-widgets">
            {data?.links?.map((item, idx) => {
              if (item.handle) {
                return (
                  <div key={idx} className="profile-widget-item">
                    <RenderWidgetItem displayName={pageTitle} item={item} />
                  </div>
                );
              }
            })}
          </div>
          {isEmptyProfile && (
            <div className="profile-widget-full">
              <div className="profile-widget">
                <Empty title="Nothing here" text="No social links, NFTs, Web3 activities or POAPs yet" />
              </div>
            </div>
          )}
          {data.address && (
            <>
              <div className="web3-section-widgets">
                <Suspense fallback={<p>Loading NFTs...</p>}>
                  <WidgetNFT
                    fromServer={fromServer}
                    onShowDetail={(e, v) => {
                      openModal(ModalType.nft, v);
                    }}
                    address={data.address}
                    initialData={nfts || []}
                  />
                </Suspense>
              </div>
              <div className="web3-section-widgets">
                <Suspense fallback={<p>Loading Activity Feeds...</p>}>
                  <WidgetFeed
                    openModal={openModal}
                    initialData={[]}
                    fromServer={fromServer}
                    profile={data}
                  />
                </Suspense>
              </div>
              <div className="web3-section-widgets">
                <Suspense fallback={<p>Loading Articles...</p>}>
                  <WidgetRSS
                    fromServer={fromServer}
                    relations={relations}
                    domain={data.identity}
                  />
                </Suspense>
              </div>
              <div className="web3-section-widgets">
                <Suspense fallback={<p>Loading DegenScore...</p>}>
                  <WidgetDegenScore address={data.address} />
                </Suspense>
              </div>
              <div className="web3-section-widgets">
                <Suspense fallback={<p>Loading POAPs...</p>}>
                  <WidgetPOAP
                    fromServer={fromServer}
                    onShowDetail={(v) => {
                      openModal(ModalType.poaps, v);
                    }}
                    address={data.address}
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="web3bio-badge">
        <Link
          href="/?utm_source=profile"
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
          <div className="toast">Copied to clipboard</div>
        </div>
      )}
    </>
  );
}
