"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import {
  PlatformSystem,
  PlatformType,
  SocialPlatformMapping,
} from "../utils/platform";
import { formatText, isValidEthereumAddress, colorMod } from "../utils/utils";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { RenderWidgetItem } from "./WidgetLinkItem";
import WidgetNFT from "./WidgetNFT";
import WidgetPOAP from "./WidgetPoap";
import WidgetFeed from "./WidgetFeed";
import AddressMenu from "./AddressMenu";
import { Avatar } from "../shared/Avatar";
import useModal, { ModalType } from "../hooks/useModal";
import Modal from "../modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../state";
import { WidgetState } from "../state/widgets/reducer";
// import { WidgetPhiland } from "./WidgetPhiland";
import { WidgetTally } from "./WidgetTally";
import LoadingSkeleton from "./LoadingSkeleton";
import ProfileFooter from "./ProfileFooter";
import WidgetIndicator from "./WidgetIndicator";
import { WidgetTypes } from "../utils/widgets";
import { DocumentNode, useLazyQuery } from "@apollo/client";
import { WidgetScores } from "./WidgetScores";
import { updateUniversalBatchedProfile } from "../state/universal/actions";
import { getProfileQuery } from "../utils/queries";
import { WidgetArticle } from "./WidgetArticle";
import WidgetGuild from "./WidgetGuild";
import { useTipEmoji } from "../hooks/useTipEmoji";
import WidgetSnapshot from "./WidgetSnapshot";

export default function ProfileMain(props) {
  const { data, pageTitle, platform, relations, domain, fallbackAvatar } =
    props;
  const [isCopied, setIsCopied] = useState(false);
  const { tipObject, tipEmoji } = useTipEmoji();
  const [links, setLinks] = useState(data?.links);
  const [getQuery, { loading, error, data: identityGraph }] = useLazyQuery(
    getProfileQuery() as DocumentNode,
    {
      variables: {
        platform: platform,
        identity: domain.endsWith(".farcaster")
          ? domain.replace(".farcaster", "")
          : domain,
      },
    }
  );
  const dispatch = useDispatch();
  const { isOpen, modalType, closeModal, openModal, params } = useModal();
  const [mounted, setMounted] = useState(false);
  const profileWidgetStates = useSelector<AppState, WidgetState>(
    (state) => state.widgets
  );
  useEffect(() => {
    if (relations?.length > 0) {
      dispatch(
        updateUniversalBatchedProfile({
          profiles: relations,
        })
      );
    }
  }, [relations, dispatch]);

  useEffect(() => {
    if (!mounted) setMounted(true);
    if (domain && platform) {
      getQuery();
    }
    if (identityGraph?.identity?.identityGraph) {
      const vertices = identityGraph.identity.identityGraph.vertices.map(
        (x) => ({
          ...x,
          platform:
            x.platform === PlatformType.dns ? PlatformType.website : x.platform,
        })
      );
      const _res = JSON.parse(JSON.stringify(data?.links));
      vertices
        .filter(
          (x) =>
            SocialPlatformMapping(x.platform).system === PlatformSystem.web2
        )
        .forEach((x) => {
          const verifiedIndex = _res.findIndex(
            (i) =>
              i.platform === x.platform &&
              i.handle.toLowerCase() ===
                (x.identity.endsWith(".lens")
                  ? x.identity.replace(".lens", "")
                  : x.identity
                ).toLowerCase()
          );
          if (verifiedIndex !== -1) {
            _res[verifiedIndex] = {
              ..._res[verifiedIndex],
              verified: true,
            };
          }
        });
      setLinks(
        _res.map((x) => {
          if (
            [PlatformType.lens, PlatformType.farcaster].includes(x.platform)
          ) {
            x.hasDetail = true;
          }
          return x;
        })
      );
    }
  }, [domain, platform, identityGraph, getQuery, mounted, data?.links]);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const isEmptyProfile = useCallback(() => {
    const source = Object.values(profileWidgetStates).filter((x) => x.loaded);
    // 6 is all widgets num - basic widgets num (nft, poaps, feeds)
    return source.length > 6 && source.every((x) => x.isEmpty && !x.parent);
  }, [profileWidgetStates])();

  const isBasicLoadingFinished = useCallback(() => {
    return (
      !profileWidgetStates.nft.initLoading &&
      !profileWidgetStates.feeds?.initLoading
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
      <WidgetIndicator states={profileWidgetStates} />

      <div className="columns">
        <div className="column col-4 col-lg-12">
          <div
            className="web3-profile-base"
            itemProp="mainEntity"
            itemType="https://schema.org/Person"
            itemScope
          >
            <div className="profile-avatar">
              <Avatar
                src={data?.avatar || fallbackAvatar.avatar}
                identity={domain}
                className="avatar"
                alt={`${pageTitle} Profile Photo`}
                itemProp="image"
              />
              {!data?.avatar && fallbackAvatar.source && (
                <div className="profile-avatar-badge">
                  <SVG
                    fill={SocialPlatformMapping(fallbackAvatar.source).color}
                    width={20}
                    src={
                      SocialPlatformMapping(fallbackAvatar.source).icon || ""
                    }
                    title={`Fallback avatar from ${
                      SocialPlatformMapping(fallbackAvatar.source).label
                    }`}
                  />
                </div>
              )}
            </div>
            <h1 className="text-assistive">
              {`${pageTitle} ${SocialPlatformMapping(platform).label} Profile`}
            </h1>
            <h2 className="text-assistive">
              {`Explore ${pageTitle} ${
                SocialPlatformMapping(platform).label
              } Web3 profiles, social links, NFT collections, Web3 activities, dWebsites, POAPs etc on the Web3.bio profile page. `}
              {`${pageTitle}‘s wallet address is ${data.address}`}
              <meta itemProp="identifier" content={data.identity} />
            </h2>
            <div className="profile-name" itemProp="name">
              {data.displayName}
            </div>
            <meta itemProp="identifier" content={data.identity} />
            <h3 className="text-assistive">{`${pageTitle}‘s wallet address is ${data.address}`}</h3>
            <div className="profile-identity">
              {data.address && (
                <div className="btn-group dropdown">
                  <Clipboard
                    component="div"
                    className="btn btn-sm"
                    data-clipboard-text={data.address}
                    onSuccess={onCopySuccess}
                    title="Copy this wallet address"
                  >
                    <SVG
                      src="../icons/icon-wallet.svg"
                      width={18}
                      height={18}
                      className="action-gray"
                    />
                    <span className="profile-label">
                      {formatText(data.address)}
                    </span>
                  </Clipboard>
                  <AddressMenu profile={data} />
                </div>
              )}
              <button
                className={`profile-share btn btn-sm`}
                title="Share this profile"
                onClick={() =>
                  openModal(ModalType.share, {
                    profile: data,
                    path: `${domain}`,
                    avatar: fallbackAvatar.avatar,
                  })
                }
              >
                <SVG src="icons/icon-share.svg" width={18} height={18} />
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
                    ["--badge-bg-color" as string]: colorMod(
                      SocialPlatformMapping(platform).color,
                      5
                    ),
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
                    key={x.platform + idx}
                    href={`/${relatedPath}`}
                    className={`platform-badge ${x.platform}${
                      idx === 0 ? " active" : ""
                    }`}
                    title={`${SocialPlatformMapping(x.platform).label}: ${
                      x.identity
                    }`}
                    style={{
                      ["--badge-primary-color" as string]:
                        SocialPlatformMapping(x.platform).color || "#000",
                      ["--badge-bg-color" as string]: colorMod(
                        SocialPlatformMapping(x.platform)?.color,
                        10
                      ),
                    }}
                    itemProp="sameAs"
                  >
                    <div className="platform-badge-icon">
                      <SVG
                        fill={SocialPlatformMapping(x.platform).color}
                        width={20}
                        height={20}
                        src={SocialPlatformMapping(x.platform).icon || ""}
                      />
                    </div>
                    <span
                      className="platform-badge-name"
                      itemProp="alternateName"
                    >
                      {x.platform === PlatformType.ethereum ||
                      x.platform === PlatformType.solana
                        ? formatText(x.identity)
                        : x.identity}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="profile-actions">
              <div className="btn-group">
                <button
                  className={`profile-share btn btn-lg active`}
                  title="Donate"
                  onClick={() => {
                    openModal(ModalType.tip, {
                      profile: data,
                      tipEmoji: tipEmoji,
                      tipObject: tipObject,
                    });
                  }}
                >
                  <span className="btn-emoji mr-1">{tipEmoji || "💸"}</span>
                  {tipObject ? `Buy Me a ${tipObject}` : "Tip"}
                </button>
              </div>
            </div>

            {data.description && (
              <h2 className="profile-description" itemProp="description">
                {data.description}
              </h2>
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
        <div className="column col-7 col-lg-12">
          <div className="web3-section-widgets">
            {links?.map((item, idx) => {
              if (item.handle) {
                return (
                  <div key={idx} className="profile-widget-item">
                    <RenderWidgetItem
                      openModal={(v) => {
                        openModal(ModalType.profile, {
                          ...v,
                        });
                      }}
                      displayName={pageTitle}
                      item={item}
                    />
                  </div>
                );
              }
            })}
          </div>

          {isEmptyProfile && (
            <div className="profile-widget-full">
              <div className="profile-widget">
                <Empty
                  title="Nothing here"
                  text="No NFTs, Web3 activities or POAPs yet"
                />
              </div>
            </div>
          )}
          {(data.address && mounted && (
            <>
              <div className="web3-section-widgets">
                <Suspense fallback={<LoadingSkeleton type={WidgetTypes.nft} />}>
                  <WidgetNFT
                    profile={data}
                    onShowDetail={(e, v) => {
                      openModal(ModalType.nft, v);
                    }}
                  />
                </Suspense>
              </div>
              <div className="web3-section-widgets">
                <Suspense
                  fallback={<LoadingSkeleton type={WidgetTypes.feeds} />}
                >
                  <WidgetFeed openModal={openModal} profile={data} />
                </Suspense>
              </div>
              {isBasicLoadingFinished && (
                <>
                  <div className="web3-section-widgets">
                    <WidgetScores
                      openModal={openModal}
                      farcasterHandle={
                        relations.find(
                          (x) => x.platform === PlatformType.farcaster
                        )?.identity
                      }
                      states={profileWidgetStates}
                      address={data.address}
                    />
                  </div>

                  <div className="web3-section-widgets">
                    <Suspense
                      fallback={<LoadingSkeleton type={WidgetTypes.article} />}
                    >
                      <WidgetArticle
                        address={data.address}
                        domain={relations?.find((x) => x.contenthash)?.identity}
                      />
                    </Suspense>
                  </div>

                  <div className="web3-section-widgets">
                    <Suspense
                      fallback={<LoadingSkeleton type={WidgetTypes.poaps} />}
                    >
                      <WidgetPOAP
                        onShowDetail={(v) => {
                          openModal(ModalType.poaps, v);
                        }}
                        address={data.address}
                      />
                    </Suspense>
                  </div>

                  {isValidEthereumAddress(data.address) && (
                    <div className="web3-section-widgets">
                      <Suspense
                        fallback={<LoadingSkeleton type={WidgetTypes.guild} />}
                      >
                        <WidgetGuild
                          onShowDetail={(v) => {
                            openModal(ModalType.guild, {
                              ...v,
                            });
                          }}
                          profile={data}
                        />
                      </Suspense>
                    </div>
                  )}

                  {isValidEthereumAddress(data.address) && (
                    <div className="web3-section-widgets">
                      <Suspense
                        fallback={
                          <LoadingSkeleton type={WidgetTypes.snapshot} />
                        }
                      >
                        <WidgetSnapshot
                          profile={data}
                          onShowDetail={(v) => {
                            openModal(ModalType.snapshot, {
                              ...v,
                            });
                          }}
                        />
                      </Suspense>
                    </div>
                  )}

                  {isValidEthereumAddress(data.address) && (
                    <div className="web3-section-widgets">
                      <Suspense
                        fallback={<LoadingSkeleton type={WidgetTypes.tally} />}
                      >
                        <WidgetTally address={data.address} />
                      </Suspense>
                    </div>
                  )}

                  {/* TODO: Due to Philand error background color, hide Phi widget for now */}
                  {/* <div className="web3-section-widgets">
                    {(data.platform === PlatformType.ens ||
                      regexEns.test(data.identity)) && (
                      <Suspense fallback={<p>Loading Phi Land...</p>}>
                        <WidgetPhiland
                          onShowDetail={(v) => {
                            openModal(ModalType.philand, {
                              profile: data,
                              data: v,
                            });
                          }}
                          domain={data.identity}
                        />
                      </Suspense>
                    )}
                  </div> */}
                </>
              )}
            </>
          )) ||
            null}
        </div>
      </div>
      <ProfileFooter />
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
