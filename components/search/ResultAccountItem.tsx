import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";
import { formatText } from "../../utils/utils";
import { RenderSourceFooter } from "./SourcesFooter";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";

const RenderAccountItem = (props) => {
  const onCopySuccess = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };
  const { identity, sources, profile, onItemClick } = props;

  const [isCopied, setIsCopied] = useState(false);
  const displayName = formatText(
    profile?.displayName
      ? profile.displayName
      : identity.displayName || identity.identity,
    30
  );
  const ressolvedIdentity =
    identity.platform === PlatformType.ethereum
      ? profile?.address || identity.identity
      : identity.identity;
  switch (identity.platform) {
    case PlatformType.ethereum:
      return (
        <div className="social-item social-web3 ethereum">
          <div className="social-main">
            <div className="social">
              <div className="avatar">
                {profile?.avatar && (
                  <img src={profile?.avatar} className="avatar-img" />
                )}
                <div className="icon bg-pride">
                  <SVG src="icons/icon-ethereum-w.svg" width={20} height={20} />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-bold">{displayName}</div>
                <div className="content-subtitle text-gray">
                  <div className="address hide-xs">{ressolvedIdentity}</div>
                  <div className="address show-xs">
                    {formatText(ressolvedIdentity)}
                  </div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={ressolvedIdentity}
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
          {profile && !profile?.error && (
            <div
              onClick={() => {
                onItemClick(
                  profile?.identity ||
                    identity.displayName ||
                    ressolvedIdentity,
                  PlatformType.ens,
                  profile
                );
              }}
              className="social-actions"
            >
              <button
                className="btn btn-sm btn-link action"
                title="Open ENS Profile"
              >
                <SVG src="icons/icon-open.svg" width={20} height={20} />
              </button>
            </div>
          )}
          <RenderSourceFooter sources={sources} />
        </div>
      );
    case PlatformType.lens:
      return (
        <div className="social-item lens">
          <div className="social-main">
            <div className="social">
              <div className="avatar">
                {profile?.avatar && (
                  <img src={profile?.avatar} className="avatar-img" />
                )}
                <div className="icon">
                  <SVG
                    src={SocialPlatformMapping(identity.platform)?.icon}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-bold">{displayName}</div>
                <div className="content-subtitle text-gray">
                  <div className="address">{ressolvedIdentity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={ressolvedIdentity}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              onItemClick(ressolvedIdentity, PlatformType.lens, profile);
            }}
            className="social-actions"
          >
            <button
              className="btn btn-sm btn-link action"
              title="Open Lens Profile"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} />
            </button>
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
                  s: ressolvedIdentity,
                },
              }}
              className="social"
            >
              <div className="icon">
                <SVG
                  src={SocialPlatformMapping(identity.platform)?.icon}
                  width={20}
                  height={20}
                />
              </div>
              <div className="title">{displayName}</div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`${SocialPlatformMapping(identity.platform)?.urlPrefix}${
                identity.displayName
              }`}
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
              <div className="avatar">
                {profile?.avatar && (
                  <img src={profile?.avatar} className="avatar-img" />
                )}
                <div className="icon">
                  <SVG
                    src={SocialPlatformMapping(identity.platform)?.icon}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-bold">{displayName}</div>
                <div className="content-subtitle text-gray">
                  <div className="address">{ressolvedIdentity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={ressolvedIdentity}
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
              href={`https://warpcast.com/${ressolvedIdentity}`}
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
              <figure className="avatar">
                <div className="icon">
                  <SVG
                    src={SocialPlatformMapping(identity.platform)?.icon}
                    width={20}
                    height={20}
                  />
                </div>
              </figure>
              <div className="content">
                <div className="content-title text-bold">{displayName}</div>
                <div className="content-subtitle text-gray">
                  <div className="address">{ressolvedIdentity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={ressolvedIdentity}
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
            <div className="social">
              <div className="avatar">
                {profile?.avatar && (
                  <img src={profile?.avatar} className="avatar-img" />
                )}
                <div className="icon">
                  <SVG
                    src={SocialPlatformMapping(identity.platform)?.icon}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="content">
                <div className="content-title text-bold">{displayName}</div>
                <div className="content-subtitle text-gray">
                  <div className="address">{ressolvedIdentity}</div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={ressolvedIdentity}
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
              href={`${SocialPlatformMapping(identity.platform)?.urlPrefix}${
                identity.displayName
              }`}
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
    case PlatformType.nextid:
      return null;
    default:
      return (
        <div className={`social-item ${identity.platform}`}>
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: {
                  s: ressolvedIdentity,
                  platform: identity.platform,
                },
              }}
              className="social"
            >
              <div className="icon">
                <SVG
                  src={SocialPlatformMapping(identity.platform)?.icon}
                  width={20}
                  height={20}
                />
              </div>
              <div className="title">{displayName}</div>
            </Link>
          </div>
          <div className="social-actions actions">
            <a
              className="btn btn-sm btn-link action"
              href={`${SocialPlatformMapping(identity.platform)?.urlPrefix}${
                identity.displayName
              }`}
              title="Open"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SVG src="icons/icon-open.svg" width={20} height={20} /> OPEN
            </a>
          </div>
          <RenderSourceFooter sources={sources} />
        </div>
      );
  }
};

export const ResultAccountItem = memo(RenderAccountItem);
