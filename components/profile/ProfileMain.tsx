"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
import { Error } from "../shared/Error";
import Avatar from "boring-avatars";
import { formatText } from "../../utils/utils";
import { RenderWidgetItem } from "./WidgetItem";
import { WidgetNFTCollection } from "./WidgetNFTCollection";
import WidgetRSS from "./WidgetRSS";
import WidgetPoap from "./WidgetPoap";
import WidgetDegenScore from "./WidgetDegenScore";
import { NFTModal, NFTModalType } from "./NFTModal";
import ShareModal from "../shared/ShareModal";
import ModalLink from "./ModalLink";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { WidgetState } from "../../state/widgets/reducer";
import AddressMenu from "./AddressMenu";

export default function ProfileMain(props) {
  const {
    data,
    pageTitle = "",
    platform,
    nfts,
    fromServer,
    relations,
    domain,
  } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [curAsset, setCurAsset] = useState(null);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const [dialogType, setDialogType] = useState(NFTModalType.NFT);
  const pathName = usePathname();
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const widgetState = useSelector<AppState, WidgetState>(
    (state) => state.widgets
  );

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
              ? `url(${data.header || data.avatar})`
              : `none`,
        }}
      ></div>
      <div className="columns">
        <div className="column col-4 col-md-12">
          <div className="web3-profile-base">
            <div className="profile-avatar">
              {data.avatar && !errorAvatar ? (
                <Image
                  src={data.avatar}
                  className="avatar"
                  alt={`${pageTitle} Avatar / Profile Photo`}
                  onError={() => {
                    setErrorAvatar(true);
                  }}
                  height={180}
                  width={180}
                />
              ) : (
                <Avatar
                  size={180}
                  name={data.identity}
                  variant="bauhaus"
                  colors={[
                    "#ECD7C8",
                    "#EEA4BC",
                    "#BE88C4",
                    "#9186E7",
                    "#92C9F9",
                  ]}
                />
              )}
            </div>
            <h1 className="text-assistive">{`${pageTitle} ${
              SocialPlatformMapping(platform).label
            } Web3 Profile`}</h1>
            <h2 className="text-assistive">{`Explore ${pageTitle} Web3 identity profile, description, crypto addresses, social links, NFT collections, POAPs, crypto assets etc on the Web3.bio Link in bio page.`}</h2>
            <div className="profile-name">{data.displayName}</div>
            <h3 className="text-assistive">{`${pageTitle}‘s Ethereum wallet address is ${data.address}`}</h3>
            <div className="profile-identity">
              <div className="btn-group dropdown">
                <Clipboard
                  component="div"
                  className="btn btn-sm"
                  data-clipboard-text={data.address}
                  onSuccess={onCopySuccess}
                  title="Copy the Ethereum wallet address"
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
                <AddressMenu address={data.address} />
              </div>
              <button
                className="profile-share btn btn-sm ml-2"
                title="Share this profile"
                onClick={() => setOpenShare(true)}
              >
                <SVG src="icons/icon-share.svg" width={20} height={20} />
                Share
              </button>
            </div>

            <div className="profile-badges">
              {platform == "nextid" && (
                <Clipboard
                  component="div"
                  className={`platform-badge nextid active c-hand`}
                  data-clipboard-text={domain}
                  onSuccess={onCopySuccess}
                  title="Copy the Next.ID address"
                >
                  <div className="platform-badge-icon">
                    <SVG
                      fill={SocialPlatformMapping(PlatformType.nextid).color}
                      width={20}
                      src={"icons/icon-nextid.svg"}
                      className="text-light"
                    />
                    <span className="platform-badge-name">
                      {formatText(domain)}
                    </span>
                  </div>
                </Clipboard>
              )}
              {relations?.map((x, idx) => {
                const relatedPath = `${x.identity}${
                  x.platform === PlatformType.farcaster ? ".farcaster" : ""
                }`;
                return (
                  <ModalLink
                    skip={fromServer ? 1 : 0}
                    href={`/${relatedPath}`}
                    key={x.platform + idx}
                    className={`platform-badge ${x.platform}${
                      idx === 0 ? " active" : ""
                    }`}
                    title={`${pageTitle} ${
                      SocialPlatformMapping(x.platform).label
                    }`}
                  >
                    <div className="platform-badge-icon">
                      <SVG
                        fill={SocialPlatformMapping(x.platform).color}
                        width={20}
                        src={SocialPlatformMapping(x.platform).icon || ""}
                      />
                    </div>
                    <span className="platform-badge-name">{x.identity}</span>
                  </ModalLink>
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
              return (
                <div key={idx} className="profile-widget-item">
                  <RenderWidgetItem displayName={pageTitle} item={item} />
                </div>
              );
            })}
          </div>
          {data.address && (
            <>
              <div className="web3-section-widgets">
                <Suspense fallback={<p>Loading NFTs...</p>}>
                  <WidgetNFTCollection
                    initialExpand={
                      Boolean(
                        widgetState.widgetState.poaps?.isEmpty &&
                          widgetState.widgetState.rss?.isEmpty
                      ) && !data?.links?.length
                    }
                    fromServer={fromServer}
                    onShowDetail={(e, v) => {
                      setDialogType(NFTModalType.NFT);
                      setCurAsset(v);
                      setDialogOpen(true);
                    }}
                    address={data.address}
                    initialData={nfts || []}
                  />
                </Suspense>
              </div>
              <div className="web3-section-widgets">
                <Suspense fallback={<p>Loading Articles...</p>}>
                  <WidgetRSS
                    relations={relations}
                    fromServer={false}
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
                <Suspense fallback={<p>Loading Poaps...</p>}>
                  <WidgetPoap
                    fromServer={fromServer}
                    onShowDetail={(v) => {
                      setDialogType(NFTModalType.POAP);
                      setCurAsset(v);
                      setDialogOpen(true);
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
      {dialogOpen && curAsset && (
        <NFTModal
          asset={curAsset}
          onClose={() => {
            setDialogOpen(false);
          }}
          type={dialogType}
        />
      )}
      {openShare && (
        <ShareModal
          profile={data}
          url={`${baseURL}${pathName?.replace("profile/", "")}`}
          onClose={() => setOpenShare(false)}
        />
      )}
      {isCopied && (
        <div className="web3bio-toast">
          <div className="toast">Copied to clipboard</div>
        </div>
      )}
    </>
  );
}
