"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import {
  PlatformSystem,
  PlatformType,
  SocialPlatformMapping,
} from "../utils/platform";
import {
  formatText,
  isValidEthereumAddress,
  colorMod,
  prettify,
  uglify,
} from "../utils/utils";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { RenderWidgetItem } from "./WidgetLinkItem";
import { Avatar } from "../shared/Avatar";
import useModal, { ModalType } from "../hooks/useModal";
import Modal from "../modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../state";
import { WidgetState } from "../state/widgets/reducer";
import LoadingSkeleton from "./LoadingSkeleton";
import ProfileFooter from "./ProfileFooter";
import WidgetIndicator from "./WidgetIndicator";
import { WidgetType } from "../utils/widgets";
import { DocumentNode, useLazyQuery } from "@apollo/client";
import { updateUniversalBatchedProfile } from "../state/universal/actions";
import { getProfileQuery } from "../utils/queries";
import { useTipEmoji } from "../hooks/useTipEmoji";
import WidgetArticle from "./WidgetArticle";
import AddressMenu from "./AddressMenu";
import WidgetNFT from "./WidgetNFT";
import WidgetFeed from "./WidgetFeed";
import WidgetScores from "./WidgetScores";
import WidgetPOAP from "./WidgetPoap";
import WidgetGuild from "./WidgetGuild";
import WidgetSnapshot from "./WidgetSnapshot";
import WidgetTally from "./WidgetTally";
import toast from "react-hot-toast";

export default function ProfileMain(props) {
  const { data, pageTitle, platform, relations, domain, fallbackAvatar } =
    props;
  const { tipObject, tipEmoji } = useTipEmoji();
  const [links, setLinks] = useState(data?.links);
  const [getQuery, { loading, error, data: identityGraph }] = useLazyQuery(
    getProfileQuery() as DocumentNode,
    {
      variables: {
        platform: platform,
        identity: prettify(domain),
      },
    }
  );
  const dispatch = useDispatch();
  const { isOpen, type, closeModal, openModal, params } = useModal();
  const [mounted, setMounted] = useState(false);
  const isEthereum = useMemo(() => {
    return isValidEthereumAddress(data.address);
  }, [data.address]);
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

  const isEmptyProfile = useMemo(() => {
    const loadedWidgets = Object.values(profileWidgetStates).filter(
      (x) => x.loaded
    );
    // 6 is all widgets num - basic widgets num (nft, poaps, feeds)
    return (
      loadedWidgets.length > 6 &&
      loadedWidgets.every((x) => x.isEmpty && !x.parent)
    );
  }, [profileWidgetStates]);

  const isBasicLoadingFinished = useMemo(() => {
    return profileWidgetStates.nft.loaded && profileWidgetStates.feeds.loaded;
  }, [profileWidgetStates]);

  const handleCopySuccess = useCallback(() => {
    toast.custom(
      <div className="toast">
        <SVG
          src="../icons/icon-copy.svg"
          width={24}
          height={24}
          className="action mr-2"
        />
        Copied to clipboard
      </div>
    );
  }, []);

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
                    onSuccess={handleCopySuccess}
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
                  onSuccess={handleCopySuccess}
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
                const relatedPath = uglify(x.identity, x.platform);
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

            {isEthereum && (
              <div className="profile-actions" style={{ display: "none" }}>
                <div className="btn-group">
                  <button
                    className={`profile-share btn btn-lg active`}
                    title="Donate"
                    onClick={() => {
                      openModal(ModalType.tip, {
                        profile: {
                          ...data,
                          avatar: fallbackAvatar?.avatar,
                        },
                        tipEmoji,
                        tipObject,
                      });
                    }}
                  >
                    <span className="btn-emoji mr-1">{"💸"}</span>
                    {"Tip"}
                  </button>
                </div>
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
                          identity: {
                            ...v,
                          },
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
                <Suspense fallback={<LoadingSkeleton type={WidgetType.nft} />}>
                  <WidgetNFT
                    profile={data}
                    openModal={(v) => {
                      openModal(ModalType.nft, {
                        asset: v,
                      });
                    }}
                  />
                </Suspense>
              </div>
              <div className="web3-section-widgets">
                <Suspense
                  fallback={<LoadingSkeleton type={WidgetType.feeds} />}
                >
                  <WidgetFeed openModal={openModal} profile={data} />
                </Suspense>
              </div>
              {isEthereum && isBasicLoadingFinished && (
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
                      profile={data}
                    />
                  </div>

                  <div className="web3-section-widgets">
                    <Suspense
                      fallback={<LoadingSkeleton type={WidgetType.article} />}
                    >
                      <WidgetArticle
                        address={data.address}
                        domain={relations?.find((x) => x.contenthash)?.identity}
                        profile={data}
                        openModal={(v) => {
                          openModal(ModalType.article, {
                            ...v,
                          });
                        }}
                      />
                    </Suspense>
                  </div>

                  <div className="web3-section-widgets">
                    <Suspense
                      fallback={<LoadingSkeleton type={WidgetType.poaps} />}
                    >
                      <WidgetPOAP
                        openModal={(v) => {
                          openModal(ModalType.poaps, v);
                        }}
                        address={data.address}
                      />
                    </Suspense>
                  </div>

                  <div className="web3-section-widgets">
                    <Suspense
                      fallback={<LoadingSkeleton type={WidgetType.guild} />}
                    >
                      <WidgetGuild
                        openModal={(v) => {
                          openModal(ModalType.guild, {
                            ...v,
                          });
                        }}
                        profile={data}
                      />
                    </Suspense>
                  </div>

                  <div className="web3-section-widgets">
                    <Suspense
                      fallback={<LoadingSkeleton type={WidgetType.snapshot} />}
                    >
                      <WidgetSnapshot
                        profile={data}
                        openModal={(v) => {
                          openModal(ModalType.snapshot, {
                            ...v,
                          });
                        }}
                      />
                    </Suspense>
                  </div>

                  <div className="web3-section-widgets">
                    <Suspense
                      fallback={<LoadingSkeleton type={WidgetType.tally} />}
                    >
                      <WidgetTally address={data.address} />
                    </Suspense>
                  </div>

                  {/* TODO: Due to Philand error background color, hide Phi widget for now */}
                  {/* <div className="web3-section-widgets">
                    {(data.platform === PlatformType.ens ||
                      regexEns.test(data.identity)) && (
                      <Suspense fallback={<p>Loading Phi Land...</p>}>
                        <WidgetPhiland
                          openModal={(v) => {
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
      <ProfileFooter openModal={openModal} />
      {isOpen && (
        <Modal params={params} onDismiss={closeModal} modalType={type} />
      )}
    </>
  );
}
