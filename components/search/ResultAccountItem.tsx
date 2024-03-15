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
import { fetchProfile } from "../../hooks/api/fetchProfile";
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
  const {
    identity,
    sources,
    profile,
    disableAction,
    onClick,
    customAction,
    expiredAt,
  } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(!!profile);
  const resolvedDisplayName = profile?.displayName
    ? profile.displayName
    : identity.displayName || identity.identity;
  const displayName =
    isAddress(resolvedDisplayName) || identity.platform === PlatformType.nextid
      ? formatText(resolvedDisplayName)
      : resolvedDisplayName;
  const resolvedIdentity = identity.identity || profile?.address;
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
  }, [fetched, identity, visible, dispatch]);
  switch (identity.platform) {
    case PlatformType.ens:
    case PlatformType.ethereum:
    case PlatformType.unstoppableDomains:
    case PlatformType.dotbit:
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
                    title="avatar"
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
                <div className="content-title text-ellipsis text-bold">
                  {displayName}
                </div>
                <div className="content-subtitle text-gray">
                  {identity.platform === PlatformType.ethereum ? (
                    <>
                      {profile?.displayName === profile?.identity ? (
                        <>
                          <div className="address hide-sm">
                            {resolvedIdentity}
                          </div>
                          <div className="address show-sm">
                            {formatText(resolvedIdentity)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="address">{profile.identity}</div>
                          <div className="ml-1 mr-1"> · </div>
                          <div className="address">
                            {formatText(resolvedIdentity)}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="address">
                      {formatText(resolvedIdentity)}
                    </div>
                  )}
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
                {expiredAt && (
                  <div className="content-expired">
                    Expired at{" "}
                    {new Date(Number(expiredAt) * 1000).toUTCString()}
                  </div>
                )}
              </div>
            </div>
            {(customAction && customAction()) || (
              <ResultAccountItemAction
                disable={disableAction}
                isActive={!profile?.error}
                href={`/${
                  profile?.identity || identity.displayName || resolvedIdentity
                }`}
                title={"Open Profile"}
                text={"Profile"}
              />
            )}
          </div>
          {identity.nft?.length > 0 && (
            <div className="nfts">
              {identity.nft.map((nft) => {
                return (
                  <Link
                    key={`${nft.uuid}`}
                    href={{
                      pathname: "/",
                      query: { s: nft.id },
                    }}
                    prefetch={false}
                  >
                    <div className="label-ens" title={nft.id}>
                      <SVG
                        fill={SocialPlatformMapping(PlatformType.ens).color}
                        src={"/icons/icon-ens.svg"}
                        width="20"
                        height="20"
                        className="icon"
                      />
                      <span>{nft.id}</span>
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
                </div>
              </div>
            </div>
            <ResultAccountItemAction
              isActive
              disable={disableAction}
              text={"Profile"}
              href={`/${
                identity.platform === PlatformType.farcaster
                  ? identity.identity + ".farcaster"
                  : identity.identity
              }`}
            />
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.nextid:
    case PlatformType.solana:
      return (
        <div ref={ref} className={`social-item ${identity.platform}`}>
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
                    background: SocialPlatformMapping(identity.platform).color,
                  }}
                >
                  <SVG
                    src={SocialPlatformMapping(identity.platform)?.icon || ""}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-bold">{formatText(displayName)}</div>
                <div className="content-subtitle text-gray">
                  <div className="address">
                    {formatText(resolvedIdentity, 24)}
                  </div>
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
              disable={disableAction}
              isActive={identity.platform === PlatformType.nextid}
              href={`/${resolvedIdentity}`}
              prefetch={false}
              title={`${
                identity.platform === PlatformType.nextid
                  ? "Open Next.ID Profile page"
                  : "Open"
              }`}
              text={`${
                identity.platform === PlatformType.nextid ? "Profile" : "Open"
              }`}
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
                  fill="#000"
                  src={SocialPlatformMapping(identity.platform)?.icon || ""}
                  width={20}
                  height={20}
                />
              </div>
              <div className="title">{displayName}</div>
            </Link>
            <ResultAccountItemAction
              disable={disableAction}
              isActive={false}
              href={`${SocialPlatformMapping(identity.platform)?.urlPrefix}${
                identity.displayName || displayName
              }`}
            />
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
  }
};

export const ResultAccountItem = memo(RenderAccountItem);
