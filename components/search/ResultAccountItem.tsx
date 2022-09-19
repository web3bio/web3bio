import React, { Component, useState } from "react";
import Link from "next/link";
import { formatAddress } from "../../utils/utils";
import Clipboard from "react-clipboard.js";
import SVG from "react-inlinesvg";

export function ResultAccountItem(props) {
  const onCopySuccess = () => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1500);
  };
  const { identity, sources } = props;
  const [isCopied, setIsCopied] = useState(false);
  switch (identity.platform) {
    case "ethereum":
      return (
        <div className="social-item social-web3 ethereum">
          <div className="social-main">
            <div className="social">
              <figure className="avatar bg-pride">
                <SVG src="icons/icon-ethereum.svg" width={20} height={20} />
              </figure>
              <div className="content">
                <div className="content-title text-bold">
                  {identity.displayName
                    ? identity.displayName
                    : formatAddress({ address: identity.identity })}
                </div>
                <div className="content-subtitle text-gray">
                  <div className="address hide-xs">{identity.identity}</div>
                  <div className="address show-xs">
                    {formatAddress({ address: identity.identity })}
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
                  <a
                    className="action text-gray"
                    href={`https://etherscan.io/address/${identity.identity}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SVG src="icons/icon-open.svg" width={20} height={20} />
                  </a>
                </div>
              </div>
            </div>
            {identity.nft?.length > 0 && (
              <div className="nfts">
                {identity.nft.map((nft) => {
                  return nft.category == "ENS" ? (
                    <Link
                      key={nft.uuid}
                      href={{
                        pathname: "/",
                        query: { s: nft.id },
                      }}
                    >
                      <a className="label-ens" title={nft.id}>
                        <SVG src="icons/icon-ens.svg" width={16} height={16} />
                        <span>{nft.id}</span>
                      </a>
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
          {sources && (
            <div className="social-footer">
              <SVG
                src="icons/icon-sources.svg"
                width={20}
                height={20}
                title="Data sources"
              />
              {sources.map((source) => (
                <span key={source} className="text-uppercase mr-1">
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    case "lens":
      return (
        <div className="social-item social-web3 lens">
          <div className="social-main">
            <div className="social">
              <figure className="avatar bg-lens">
                <SVG src="icons/icon-lens.svg" width={20} height={20} />
              </figure>
              <div className="content">
                <div className="content-title text-bold">
                  {identity.displayName
                    ? identity.displayName
                    : formatAddress({ address: identity.identity })}
                </div>
                <div className="content-subtitle text-gray">
                  <div className="address hide-xs">{identity.ownedBy.displayName}</div>
                  <div className="address show-xs">
                    {identity.ownedBy.displayName}
                  </div>
                  <Clipboard
                    component="div"
                    className="action"
                    data-clipboard-text={identity.ownedBy.displayName}
                    onSuccess={onCopySuccess}
                  >
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    {isCopied && <div className="tooltip-copy">COPIED</div>}
                  </Clipboard>
                  {/* <a
                    className="action text-gray"
                    href={`https://www.lensfrens.xyz/${identity.identity}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SVG src="icons/icon-open.svg" width={20} height={20} />
                  </a> */}
                </div>
              </div>
            </div>
            {identity.nft?.length > 0 && (
              <div className="nfts">
                {identity.nft.map((nft) => {
                  return nft.category == "ENS" ? (
                    <Link
                      key={nft.uuid}
                      href={{
                        pathname: "/",
                        query: { s: nft.id },
                      }}
                    >
                      <a className="label-ens" title={nft.id}>
                        <SVG src="icons/icon-ens.svg" width={16} height={16} />
                        <span>{nft.id}</span>
                      </a>
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
          {sources && (
            <div className="social-footer">
              <SVG
                src="icons/icon-sources.svg"
                width={20}
                height={20}
                title="Data sources"
              />
              {sources.map((source) => (
                <span key={source} className="text-uppercase mr-1">
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    case "twitter":
      return (
        <div className="social-item twitter">
          <div className="social-main">
            <Link
              href={{
                pathname: "/",
                query: { s: identity.identity },
              }}
            >
              <a className="social">
                <div className="icon">
                  <SVG src="icons/icon-twitter.svg" width={20} height={20} />
                </div>
                <div className="content-title">{identity.displayName}</div>
              </a>
            </Link>
            <div className="actions">
              <a
                className="btn btn-sm btn-link action"
                href={`https://twitter.com/${identity.identity}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                OPEN
              </a>
              <Clipboard
                className="btn btn-sm btn-link action"
                data-clipboard-text={identity.identity}
                onSuccess={onCopySuccess}
              >
                COPY
                {isCopied && <div className="tooltip-copy">COPIED</div>}
              </Clipboard>
            </div>
          </div>
          {sources && (
            <div className="social-footer">
              <SVG
                src="icons/icon-sources.svg"
                width={20}
                height={20}
                title="Data sources"
              />
              {sources.map((source) => (
                <span key={source} className="text-uppercase mr-1">
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    case "github":
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
            >
              <a className="social">
                <div className="icon">
                  <SVG src="icons/icon-github.svg" width={20} height={20} />
                </div>
                <div className="content-title">{identity.displayName}</div>
              </a>
            </Link>
            <div className="actions">
              <a
                className="btn btn-sm btn-link action"
                href={`https://github.com/${identity.identity}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                OPEN
              </a>
              <Clipboard
                className="btn btn-sm btn-link action"
                data-clipboard-text={identity.identity}
                onSuccess={onCopySuccess}
              >
                COPY
                {isCopied && <div className="tooltip-copy">COPIED</div>}
              </Clipboard>
            </div>
          </div>
          {sources && (
            <div className="social-footer">
              <SVG
                src="icons/icon-sources.svg"
                width={20}
                height={20}
                title="Data sources"
              />
              {sources.map((source) => (
                <span key={source} className="text-uppercase mr-1">
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    case "keybase":
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
            >
              <a className="social">
                <div className="icon">
                  <SVG src="icons/icon-keybase.svg" width={20} height={20} />
                </div>
                <div className="content-title">{identity.displayName}</div>
              </a>
            </Link>
            <div className="actions">
              <a
                className="btn btn-sm btn-link action"
                href={`https://keybase.io/${identity.displayName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                OPEN
              </a>
              <Clipboard
                className="btn btn-sm btn-link action"
                data-clipboard-text={identity.displayName}
                onSuccess={onCopySuccess}
              >
                COPY
                {isCopied && <div className="tooltip-copy">COPIED</div>}
              </Clipboard>
            </div>
          </div>
          {sources && (
            <div className="social-footer">
              <SVG
                src="icons/icon-sources.svg"
                width={20}
                height={20}
                title="Data sources"
              />
              {sources.map((source) => (
                <span key={source} className="text-uppercase mr-1">
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>
      );
      case "reddit":
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
              >
                <a className="social">
                  <div className="icon">
                    <SVG src="icons/icon-reddit.svg" width={20} height={20} />
                  </div>
                  <div className="content-title">{identity.displayName}</div>
                </a>
              </Link>
              <div className="actions">
                <a
                  className="btn btn-sm btn-link action"
                  href={`https://www.reddit.com/user/${identity.displayName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN
                </a>
                <Clipboard
                  className="btn btn-sm btn-link action"
                  data-clipboard-text={identity.displayName}
                  onSuccess={onCopySuccess}
                >
                  COPY
                  {isCopied && <div className="tooltip-copy">COPIED</div>}
                </Clipboard>
              </div>
            </div>
            {sources && (
              <div className="social-footer">
                <SVG
                  src="icons/icon-sources.svg"
                  width={20}
                  height={20}
                  title="Data sources"
                />
                {sources.map((source) => (
                  <span key={source} className="text-uppercase mr-1">
                    {source}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
    default:
      return null;
  }
}
