import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { formatText } from "../utils/utils";
import { RenderSourceFooter } from "./SourcesFooter";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { fetchProfile } from "../hooks/fetchProfile";
import { updateUniversalBatchedProfile } from "../state/universal/actions";
import ResultAccountItemAction from "./ResultAccountAction";

const RenderAccountItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const ref = useRef<HTMLDivElement>(null);
  const nftContainer = useRef<HTMLDivElement>(null);
  const { identity, sources, profile, onClick } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expand, setExpand] = useState(false);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(!!profile);
  const rawDisplayName = profile?.displayName
    ? profile.displayName
    : identity.displayName || identity.identity;
  const resolvedIdentity =
    profile?.address ||
    identity.resolveAddress?.[0].address ||
    identity.identity;
  useEffect(() => {
    if (nftContainer.current?.offsetHeight! <= 110) {
      setExpand(true);
    }
  }, [nftContainer]);
  useEffect(() => {
    const element = ref?.current;
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);

    if (element) {
      observer.observe(element);
    }

    const fetchProfileData = async () => {
      const response = await fetchProfile(identity).then((x) => ({
        ...x,
        uuid: identity.uuid,
      }));
      if (response) {
        dispatch(
          updateUniversalBatchedProfile({
            profiles: [response],
          })
        );
        setFetched(true);
      }
    };
    if (
      !fetched &&
      (identity?.reverse ||
        [PlatformType.farcaster, PlatformType.lens].includes(
          identity.platform
        )) &&
      visible
    ) {
      fetchProfileData();
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [fetched, identity, visible]);

  switch (identity.platform) {
    case PlatformType.ens:
    case PlatformType.ethereum:
    case PlatformType.unstoppableDomains:
    case PlatformType.dotbit:
    case PlatformType.space_id:
    case PlatformType.solana:
    case PlatformType.sns:
    case PlatformType.genome:
    case PlatformType.nextid:
    case PlatformType.crossbell:
      return (
        <div
          onClick={onClick}
          ref={ref}
          className={`social-item ${identity.platform}${
            identity.isOwner ? " social-item-owner" : ""
          }`}
        >
          <div className="social-main">
            <div className="social">
              <div className="avatar">
                {profile?.avatar && (
                  <Image
                    width={36}
                    height={36}
                    alt="avatar"
                    title="Profile Picture"
                    src={profile?.avatar}
                    className="avatar-img"
                  />
                )}
                <div
                  className="icon"
                  style={{
                    background: SocialPlatformMapping(identity.platform).color,
                    color: "#fff",
                  }}
                >
                  <SVG
                    src={SocialPlatformMapping(identity.platform)?.icon || ""}
                    fill={"#fff"}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div
                  className="content-title text-ellipsis text-bold"
                  title={rawDisplayName}
                >
                  {rawDisplayName}
                </div>
                <div className="content-subtitle text-gray">
                  {profile?.displayName !== profile?.identity && (
                    <>
                      <div className="address">
                        {profile.identity || identity.identity}
                      </div>
                      <div className="ml-1 mr-1"> · </div>
                    </>
                  )}
                  {identity.platform === PlatformType.crossbell && (
                    <>
                      <div className="address">
                        {formatText(identity.identity)}
                      </div>
                      <div className="ml-1 mr-1"> · </div>
                    </>
                  )}
                  <div className="address">{formatText(resolvedIdentity)}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={resolvedIdentity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG
                      src={
                        isCopied
                          ? "../icons/icon-check.svg"
                          : "../icons/icon-copy.svg"
                      }
                      width={20}
                      height={20}
                    />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
            {!profile?.error && (
              <ResultAccountItemAction
                isActive={!!profile?.identity}
                href={`/${
                  profile?.identity || identity.displayName || resolvedIdentity
                }`}
                classes=""
                prefetch={false}
                platform={identity.platform}
                text={"Profile"}
              />
            )}
          </div>
          {identity.nft?.length > 0 && (
            <div
              className="nfts"
              ref={nftContainer}
              style={{
                maxHeight: expand ? "unset" : "7.6rem",
              }}
            >
              <div className={`nfts-list-container `}>
                {identity.nft.map((nft) => {
                  const nftPlatform =
                    nft.chain === PlatformType.ethereum
                      ? PlatformType.ens
                      : PlatformType.sns;

                  return (
                    <Link
                      key={`${nft.uuid}`}
                      href={{
                        pathname: "/",
                        query: { s: nft.id },
                      }}
                      prefetch={false}
                    >
                      <div className="label-domain" title={nft.id}>
                        <SVG
                          fill={SocialPlatformMapping(nftPlatform).color}
                          src={SocialPlatformMapping(nftPlatform).icon!}
                          width="20"
                          height="20"
                          className="icon"
                        />
                        <span>{nft.identity || nft.id}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {!expand && (
                <div
                  className="btn-list-more"
                  onClick={() => {
                    setExpand(true);
                  }}
                >
                  <button className="btn btn-sm btn-block">View More</button>
                </div>
              )}
            </div>
          )}
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.lens:
    case PlatformType.farcaster:
      return (
        <div
          onClick={onClick}
          ref={ref}
          className={`social-item ${identity.platform}`}
        >
          <div className="social-main">
            <div className="social">
              <div className="avatar">
                {profile?.avatar && (
                  <Image
                    width={36}
                    height={36}
                    alt="avatar"
                    src={profile?.avatar}
                    className="avatar-img"
                  />
                )}
                <div
                  className="icon"
                  style={{
                    background: SocialPlatformMapping(identity.platform).color,
                  }}
                >
                  <SVG
                    src={SocialPlatformMapping(identity.platform)?.icon || ""}
                    fill={"#fff"}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-bold">
                  {profile?.displayName ||
                    identity.displayName ||
                    identity.identity}
                </div>
                <div className="content-subtitle text-gray">
                  {identity.uid && (
                    <>
                      <div
                        className="address"
                        title={`${
                          SocialPlatformMapping(identity.platform)?.label
                        } ${
                          identity.platform === PlatformType.farcaster
                            ? "FID"
                            : "UID"
                        }`}
                      >
                        #{identity.uid}
                      </div>
                      <div className="ml-1 mr-1"> · </div>
                    </>
                  )}
                  <div className="address">{identity.identity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={identity.identity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG
                      src={
                        isCopied
                          ? "../icons/icon-check.svg"
                          : "../icons/icon-copy.svg"
                      }
                      width={20}
                      height={20}
                    />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
            <ResultAccountItemAction
              isActive
              href={`/${
                identity.platform === PlatformType.farcaster
                  ? identity.identity + ".farcaster"
                  : identity.identity
              }`}
              platform={identity.platform}
              text={"Profile"}
            />
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    default:
      return (
        <div
          onClick={onClick}
          ref={ref}
          className={`social-item ${identity.platform}`}
        >
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: {
                  s: resolvedIdentity,
                  platform: identity.platform,
                },
              }}
              prefetch={false}
              className="social"
            >
              <div className="icon">
                <SVG
                  fill={"#000"}
                  src={SocialPlatformMapping(identity.platform)?.icon || ""}
                  width={20}
                  height={20}
                />
              </div>
              <div className="title">{rawDisplayName}</div>
            </Link>
            <div className={`actions`}>
              <Clipboard
                component="button"
                className="btn btn-sm btn-link action"
                data-clipboard-text={resolvedIdentity}
                onSuccess={onCopySuccess}
              >
                <SVG
                  src={
                    isCopied
                      ? "../icons/icon-check.svg"
                      : "../icons/icon-copy.svg"
                  }
                  width={20}
                  height={20}
                />
                <span className="hide-xs">Copy</span>
              </Clipboard>
              <Link
                target={"_blank"}
                className="btn btn-sm btn-link action"
                href={`${SocialPlatformMapping(identity.platform)?.urlPrefix}${
                  identity.identity
                }`}
                prefetch={false}
                title={`Open ${
                  SocialPlatformMapping(identity.platform).label
                } Link`}
                rel="noopener noreferrer"
              >
                <SVG src="icons/icon-open.svg" width={20} height={20} />
                <span className="hide-xs">{"Open"}</span>
              </Link>
            </div>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
  }
};

export const ResultAccountItem = memo(RenderAccountItem);
