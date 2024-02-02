"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { PlatformType } from "../../utils/platform";
import {
  SocialPlatformMapping,
  formatText,
  colorMod,
  handleSearchPlatform,
} from "../../utils/utils";
import { Error } from "../shared/Error";
import { Empty } from "../shared/Empty";
import { RenderWidgetItem } from "./WidgetLinkItem";
import WidgetNFT from "./WidgetNFT";
import WidgetPOAP from "./WidgetPoap";
import WidgetFeed from "./WidgetFeed";
import AddressMenu from "./AddressMenu";
import { Avatar } from "../shared/Avatar";
import useModal, { ModalType } from "../../hooks/useModal";
import Modal from "../modal/Modal";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { WidgetState } from "../../state/widgets/reducer";
import { WidgetDegenScore } from "./WidgetDegenScore";
import { WidgetRSS } from "./WidgetRSS";
import { WidgetPhiland } from "./WidgetPhiland";
import { regexEns } from "../../utils/regexp";
import LoadingSkeleton from "./LoadingSkeleton";
import { WidgetTypes } from "../../utils/profile";
import { GraphType } from "../search/ResultAccount";
import D3ResultGraph from "../graph/D3ResultGraph";
import {
  GET_PROFILE_IDENTITY_GRAPH,
  GET_PROFILE_SOCIAL_GRAPH,
} from "../../utils/queries";
import { useLazyQuery } from "@apollo/client";

export default function ProfileMain(props) {
  const { data, pageTitle, platform, nfts, relations, domain, fallbackAvatar } =
    props;
  const [isCopied, setIsCopied] = useState(false);
  const { isOpen, modalType, closeModal, openModal, params } = useModal();
  const [mounted, setMounted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphType, setGraphType] = useState(GraphType.socialGraph);
  const [graphId, setGraphId] = useState("");
  const [title, setTitle] = useState(domain);
  const profileWidgetStates = useSelector<AppState, WidgetState>(
    (state) => state.widgets
  );

  const [socialGraph, setSocialGraph] = useState<any>(null);
  const [identityGraph, setIdentityGraph] = useState<any>(null);
  const [
    querySocialGraph,
    {
      loading: socialGraphLoading,
      error: socialGraphError,
      data: socialGraphData,
    },
  ] = useLazyQuery(GET_PROFILE_SOCIAL_GRAPH, {
    variables: {
      platform: platform,
      identity: domain,
    },
  });
  const [queryIdentityGraph, { loading, error, data: identityGraphData }] =
    useLazyQuery(GET_PROFILE_IDENTITY_GRAPH, {
      variables: {
        graphId: graphId,
      },
    });
  useEffect(() => {
    setMounted(true);
  }, []);
  // social graph
  useEffect(() => {
    if (mounted && domain && platform) querySocialGraph();
    if (!socialGraphData) return;
    setIdentityGraph({
      nodes: socialGraphData.socialFollows.identityGraph.vertices,
      edges: socialGraphData.socialFollows.identityGraph.edges,
    });
    const _socialGraph = {
      nodes: new Array(),
      edges: new Array(),
    };
    socialGraphData.socialFollows.followingTopology.forEach((x) => {
      _socialGraph.nodes.push({
        ...x.originalSource,
        id: x.source,
      });

      _socialGraph.nodes.push({
        ...x.originalTarget,
        id: x.target,
      });
      _socialGraph.edges.push({
        source: x.source,
        target: x.target,
        dataSource: x.dataSource,
        label: "following",
      });
    });
    socialGraphData.socialFollows.followerTopology.forEach((x) => {
      _socialGraph.nodes.push({
        ...x.originalSource,
        id: x.source,
      });

      _socialGraph.nodes.push({
        ...x.originalTarget,
        id: x.target,
      });
      _socialGraph.edges.push({
        source: x.source,
        target: x.target,
        dataSource: x.dataSource,
        label: "followed by",
      });
    });
    setSocialGraph(_socialGraph);
  }, [socialGraphData, platform, domain, querySocialGraph, mounted]);
  // identity graph
  useEffect(() => {
    if (graphId) {
      queryIdentityGraph();
      if (!identityGraphData || !identityGraphData?.queryIdentityGraph?.length)
        return;
      setIdentityGraph({
        nodes: identityGraphData.queryIdentityGraph[0].vertices,
        edges: identityGraphData.queryIdentityGraph[0].edges,
      });
      setGraphType(1);
      setGraphId("");
    }
  }, [graphId, identityGraphData, queryIdentityGraph]);
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const isEmptyProfile = useCallback(() => {
    const source = Object.values(profileWidgetStates).filter((x) => x.loaded);
    return source.length >= 4 && source.every((x) => x.isEmpty);
  }, [profileWidgetStates])();

  const isBasicLoadingFinished = useCallback(() => {
    return (
      !profileWidgetStates.nft.initLoading &&
      !profileWidgetStates.poaps?.initLoading &&
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
      {showGraph && (
        <D3ResultGraph
          graphType={graphType}
          expandIdentity={(identity) => {
            setGraphId(identity.id);
            setTitle(identity.displayName);
          }}
          onBack={() => {
            setGraphType(GraphType.socialGraph);
            setTitle(domain);
          }}
          onClose={() => {
            setGraphType(0);
            setShowGraph(false);
          }}
          data={
            graphType === GraphType.socialGraph ? socialGraph : identityGraph
          }
          title={title}
        />
      )}
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
                src={data?.avatar || fallbackAvatar.avatar}
                identity={domain}
                className="avatar"
                alt={`${pageTitle} Profile Photo`}
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
                  title="Copy this wallet address"
                >
                  <SVG
                    src="../icons/icon-wallet.svg"
                    width={20}
                    height={20}
                    className="action-gray"
                  />
                  <span className="profile-label ml-1 mr-1">
                    {formatText(data.address)}
                  </span>
                </Clipboard>
                <Clipboard
                  component="div"
                  className="btn btn-sm"
                  data-clipboard-text={data.address}
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
                <AddressMenu profile={data} />
              </div>
              <button
                className="profile-share btn btn-sm ml-2"
                title="Share this profile"
                onClick={() =>
                  openModal(ModalType.share, {
                    profile: data,
                    path: `${domain}`,
                    avatar: fallbackAvatar.avatar,
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
                      colorMod(SocialPlatformMapping(platform).color, 5) ||
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
                    key={x.platform + idx}
                    href={`/${relatedPath}`}
                    className={`platform-badge ${x.platform}${
                      idx === 0 ? " active" : ""
                    }`}
                    title={`${pageTitle} ${
                      SocialPlatformMapping(x.platform).label
                    }: ${x.identity}`}
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
                      {x.platform === PlatformType.ethereum
                        ? formatText(x.identity)
                        : x.identity}
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
            {
              <div
                className="btn btn-link btn-sm"
                onClick={() => setShowGraph(true)}
              >
                <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
                Social Graph for {domain}
              </div>
            }
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
                    onShowDetail={(e, v) => {
                      openModal(ModalType.nft, v);
                    }}
                    address={data.address}
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

              {isBasicLoadingFinished && (
                <>
                  {([PlatformType.ens, PlatformType.dotbit].includes(
                    data.platform
                  ) ||
                    regexEns.test(data.identity)) &&
                    data.contenthash && (
                      <div className="web3-section-widgets">
                        <Suspense
                          fallback={<LoadingSkeleton type={WidgetTypes.rss} />}
                        >
                          <WidgetRSS domain={data.identity} />
                        </Suspense>
                      </div>
                    )}

                  <div className="web3-section-widgets">
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
                    <Suspense fallback={<p>Loading DegenScore...</p>}>
                      <WidgetDegenScore address={data.address} />
                    </Suspense>
                  </div>
                </>
              )}
            </>
          )) ||
            null}
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
          <div className="badge-emoji mr-1">🖖</div>Made with{" "}
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
