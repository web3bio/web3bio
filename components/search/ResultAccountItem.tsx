import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { formatText } from "../../utils/utils";
import { RenderSourceFooter } from "./SourcesFooter";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/utils";
import { isAddress } from "ethers";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { fetchProfile } from "../../hooks/fetchProfile";
import { updateUniversalBatchedProfile } from "../../state/universal/actions";
import ResultAccountItemAction from "./ResultAccountAction";

const RenderAccountItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const ref = useRef(null);
  const { identity, sources, profile, onClick } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(!!profile);
  const resolvedDisplayName = profile?.displayName
    ? profile.displayName
    : identity.displayName || identity.identity;
  const resolvedPlatform = identity.platform;
  const displayName =
    isAddress(resolvedDisplayName) || resolvedPlatform === PlatformType.nextid
      ? formatText(resolvedDisplayName)
      : resolvedDisplayName;
  const resolvedIdentity =
    profile?.address ||
    identity.resolveAddress?.[0].address ||
    identity.identity;
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
        await dispatch(
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
        [
          PlatformType.farcaster,
          PlatformType.lens,
          PlatformType.solana,
        ].includes(resolvedPlatform)) &&
      visible
    ) {
      fetchProfileData();
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [fetched, identity, visible, dispatch]);

  switch (resolvedPlatform) {
    case PlatformType.ens:
    case PlatformType.ethereum:
    case PlatformType.unstoppableDomains:
    case PlatformType.dotbit:
    case PlatformType.space_id:
    case PlatformType.solana:
    case PlatformType.sns:
      return (
        <div
          onClick={onClick}
          ref={ref}
          className={`social-item ${resolvedPlatform}${
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
                    title="avatar"
                    src={profile?.avatar}
                    className="avatar-img"
                  />
                )}
                <div
                  className="icon"
                  style={{
                    background: SocialPlatformMapping(resolvedPlatform).color,
                    color: "#fff",
                  }}
                >
                  <SVG
                    src={SocialPlatformMapping(resolvedPlatform)?.icon || ""}
                    fill={"#fff"}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-ellipsis text-bold">
                  {displayName}
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
                  <div className="address">{formatText(resolvedIdentity)}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={resolvedIdentity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
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
                platform={identity.platform}
                text={"Profile"}
              />
            )}
          </div>
          {identity.nft?.length > 0 && (
            <div className="nfts">
              {identity.nft.map((nft) => {
                // console.log(nft)
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
                        fill={SocialPlatformMapping(nft.platform || nft.category).color}
                        src={
                          SocialPlatformMapping(
                            nft.platform || nft.category
                          ).icon!
                        }
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
          className={`social-item ${resolvedPlatform}`}
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
                    background: SocialPlatformMapping(resolvedPlatform).color,
                  }}
                >
                  <SVG
                    src={SocialPlatformMapping(resolvedPlatform)?.icon || ""}
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
                          SocialPlatformMapping(resolvedPlatform)?.label
                        } ${
                          resolvedPlatform === PlatformType.farcaster
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
    case PlatformType.nextid:
    case PlatformType.crossbell:
      return (
        <div ref={ref} className={`social-item ${resolvedPlatform}`}>
          <div className="social-main">
            <div className="social">
              <div className="avatar">
                {profile?.avatar && (
                  <Image
                    width={18}
                    height={18}
                    alt="avatar"
                    src={profile?.avatar}
                    className="avatar-img"
                  />
                )}
                <div
                  className="icon"
                  style={{
                    background: SocialPlatformMapping(resolvedPlatform).color,
                  }}
                >
                  <SVG
                    src={SocialPlatformMapping(resolvedPlatform)?.icon || ""}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-bold">
                  {formatText(displayName)}
                </div>
                <div className="content-subtitle text-gray">
                  {identity.platform === PlatformType.crossbell && (
                    <>
                      <div className="address">
                        {formatText(identity.identity, 24)}
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
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
            <ResultAccountItemAction
              isActive
              prefetch={false}
              href={`/${resolvedIdentity}`}
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
          className={`social-item ${resolvedPlatform}`}
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
                  src={SocialPlatformMapping(resolvedPlatform)?.icon || ""}
                  width={20}
                  height={20}
                />
              </div>
              <div className="title">{displayName}</div>
            </Link>
            <ResultAccountItemAction
              prefetch={false}
              href={`${SocialPlatformMapping(resolvedPlatform)?.urlPrefix}${
                identity.identity
              }`}
              platform={identity.platform}
            />
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
  }
};

export const ResultAccountItem = memo(RenderAccountItem);
