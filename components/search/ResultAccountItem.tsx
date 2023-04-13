import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { formatText } from "../../utils/utils";
import { RenderSourceFooter } from "./SourcesFooter";
import { PlatformType } from "../../utils/platform";
import { useSearchProfile } from "../../hooks/useSearchProfile";
import { Avatar } from "../shared/Avatar";

const resolveSearchHandle = (identity) => {
  return {
    [PlatformType.ethereum]: identity.displayName,
    [PlatformType.twitter]: identity.identity,
    [PlatformType.farcaster]: identity.identity,
    [PlatformType.dotbit]: identity.identity,
    [PlatformType.lens]: identity.identity,
  }[identity.platform];
};

const RenderAccountItem = (props) => {
  const { onItemClick } = props;
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const { identity, sources } = props;
  const [profileHandle, setProfileHandle] = useState(null);
  const [profilePlatform, setProfilePlatform] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const {
    data: profile,
    trigger,
    isMutating,
  } = useSearchProfile({
    handle: profileHandle,
    platform: profilePlatform,
  });
  useEffect(() => {
    if (
      ![
        PlatformType.twitter,
        PlatformType.ethereum,
        PlatformType.farcaster,
        PlatformType.dotbit,
        PlatformType.lens,
      ].includes(identity.platform)
    )
      return;
    setProfileHandle(resolveSearchHandle(identity));
    setProfilePlatform(
      identity.platform === PlatformType.ethereum
        ? PlatformType.ens
        : identity.platform
    );
    trigger();
  }, [identity, trigger, profileHandle, profilePlatform]);

  // if (isMutating)
  //   return (
  //     <div className="social-item social-web3">
  //       {/* loading here */}
  //       loading...
  //     </div>
  //   );
  switch (identity.platform) {
    case PlatformType.ethereum:
      return (
        <div className="social-item social-web3 ethereum">
          <div className="social-main">
            <div className="social">
              <Avatar
                className=" bg-pride"
                src={profile?.avatar}
                width={20}
                height={20}
                fallbackImg="icons/icon-ethereum.svg"
                fallbackClassName="avatar bg-pride"
              />
              <div className="content">
                <div className="content-title text-bold">
                  {identity.displayName
                    ? identity.displayName
                    : formatText(identity.identity)}
                </div>
                <div className="content-subtitle text-gray">
                  <div className="address hide-xs">{identity.identity}</div>
                  <div className="address show-xs">
                    {formatText(identity.identity)}
                  </div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={identity.identity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
            {identity.nft?.length > 0 && (
              <div className="nfts">
                {identity.nft.map((nft, idx) => {
                  return nft.category == "ENS" ? (
                    <Link
                      key={`${nft.uuid}-${idx}`}
                      href={{
                        pathname: "/",
                        query: { s: nft.id },
                      }}
                    >
                      <div className="label-ens" title={nft.id}>
                        <Image
                          src="/icons/icon-ens.svg"
                          width={16}
                          height={16}
                          alt="ens"
                        />
                        <span>{nft.id}</span>
                      </div>
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
          <div className="social-actions">
            <button
              className="btn btn-sm btn-link action"
              title="Open Identity Panel"
              onClickCapture={() => onItemClick(identity, PlatformType.ens)}
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} />
            </button>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.lens:
      return (
        <div className="social-item lens">
          <div className="social-main">
            <div className="social">
              <Avatar
                src={profile?.avatar}
                width={20}
                height={20}
                fallbackImg="icons/icon-lens.svg"
                fallbackClassName="avatar bg-lens"
              />
              <div className="content">
                <div className="content-title text-bold">
                  {identity.displayName
                    ? identity.displayName
                    : identity.identity}
                </div>
                <div className="content-subtitle text-gray">
                  <div className="address">{identity.identity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={identity.identity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
          </div>
          <div className="social-actions">
            <button
              className="btn btn-sm btn-link action"
              title="Open Identity Panel"
              onClickCapture={() => {
                onItemClick(identity, PlatformType.lens);
              }}
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} />
            </button>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.dotbit:
      return (
        <div className="social-item dotbit">
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: {
                  s: identity.identity,
                },
              }}
              className="social"
            >
              <Avatar
                src={profile?.avatar}
                width={20}
                height={20}
                fallbackImg="icons/icon-dotbit.svg"
                fallbackClassName="icon"
              />

              <div className="title">{identity.displayName}</div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`https://data.did.id/${identity.displayName}`}
              title="Open .bit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.unstoppableDomains:
      return (
        <div className="social-item unstoppabledomains">
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: {
                  s: identity.identity,
                },
              }}
              className="social"
            >
              <div className="icon">
                <SVG
                  src="icons/icon-unstoppabledomains.svg"
                  width={20}
                  height={20}
                />
              </div>
              <div className="title">{identity.displayName}</div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`https://ud.me/${identity.displayName}`}
              title="Open Unstoppable Domains"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.farcaster:
      return (
        <div className="social-item farcaster">
          <div className="social-main">
            <div className="social">
              <Avatar
                src={profile?.avatar}
                width={20}
                height={20}
                fallbackClassName="avatar bg-farcaster"
                fallbackImg="icons/icon-farcaster.svg"
              />
              <div className="content">
                <div className="content-title text-bold">
                  {identity.displayName
                    ? identity.displayName
                    : identity.identity}
                </div>
                <div className="content-subtitle text-gray">
                  <div className="address">{identity.identity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={identity.identity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`https://warpcast.com/${identity.identity}`}
              title="Open Warpcast"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.space_id:
      return (
        <div className="social-item spaceid">
          <div className="social-main">
            <div className="social">
              <figure className="avatar bg-spaceid">
                <SVG src="icons/icon-spaceid.svg" width={20} height={20} />
              </figure>
              <div className="content">
                <div className="content-title text-bold">
                  {identity.displayName
                    ? identity.displayName
                    : identity.identity}
                </div>
                <div className="content-subtitle text-gray">
                  <div className="address">{identity.ownedBy.identity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={identity.ownedBy.identity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.twitter:
      return (
        <div className="social-item twitter">
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: { s: identity.identity },
              }}
              className="social"
            >
              <Avatar
                src={profile?.avatar}
                width={20}
                height={20}
                fallbackImg="icons/icon-twitter.svg"
                fallbackClassName="icon"
              />
              <div className="content">
                <div className="content-title text-bold">
                  {profile?.displayName
                    ? profile.displayName
                    : identity.displayName}
                </div>
                <div className="content-subtitle text-gray">
                  <div className="address">
                    {profile?.identity || identity.identity}
                  </div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={profile?.identity || identity.identity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`https://twitter.com/${identity.identity}`}
              title="Open Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.github:
      return (
        <div className="social-item github">
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: {
                  s: identity.identity,
                  platform: identity.platform,
                },
              }}
              className="social"
            >
              <div className="icon">
                <SVG src="icons/icon-github.svg" width={20} height={20} />
              </div>
              <div className="title">{identity.displayName}</div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`https://github.com/${identity.identity}`}
              title="Open GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.keybase:
      return (
        <div className="social-item keybase">
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: {
                  s: identity.identity,
                  platform: identity.platform,
                },
              }}
              className="social"
            >
              <div className="icon">
                <SVG src="icons/icon-keybase.svg" width={20} height={20} />
              </div>
              <div className="title">{identity.displayName}</div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`https://keybase.io/${identity.displayName}`}
              title="Open Keybase"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.reddit:
      return (
        <div className="social-item reddit">
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: {
                  s: identity.identity,
                  platform: identity.platform,
                },
              }}
              className="social"
            >
              <div className="icon">
                <SVG src="icons/icon-reddit.svg" width={20} height={20} />
              </div>
              <div className="title">{identity.displayName}</div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`https://www.reddit.com/user/${identity.displayName}`}
              title="Open Reddit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
    default:
      return null;
  }
};

export const ResultAccountItem = memo(RenderAccountItem);
