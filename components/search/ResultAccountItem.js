import React, { Component } from 'react'
import Clipboard from 'react-clipboard.js'
import SVG from 'react-inlinesvg'

class ResultAccountItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { identity } = this.props

    switch (identity.platform) {
      case 'ethereum':
        return (
          <>
            <div className="social-item">
              <a className="social ethereum" href={`https://etherscan.io/address/${identity.displayName ? identity.displayName : identity.identity}`} target="_blank" rel="noopener noreferrer">
                <div className='icon'>
                  <SVG src="icons/icon-ethereum.svg" width={18} height={18} />
                </div>
                <div className="text-ellipsis">
                  {identity.displayName ? identity.displayName : identity.identity}
                </div>
              </a>
              <div className="actions">
                <Clipboard className="btn btn-sm btn-link action" data-clipboard-text={identity.displayName ? identity.displayName : identity.identity}>
                  COPY
                </Clipboard>
              </div>
            </div>
            {identity.nft?.length > 0 && (
              <div className="nfts">
                {identity.nft.map((nft) =>
                  {return nft.category == 'ENS' ? (
                      <div className="label-ens" key={nft.uuid} title={nft.id}>
                        <SVG src="icons/icon-ens.svg" width={14} height={14} />
                        <span>{nft.id}</span>
                      </div>
                    ) : null}
                )}
              </div>
            )}
          </>
        )
      case 'twitter':
        return (
          <div className="social-item">
            <a className="social twitter" href={`https://twitter.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
              <div className='icon'>
                <SVG src="icons/icon-twitter.svg" width={18} height={18} />
              </div>
              {identity.displayName}
            </a>
            <div className="actions">
              <a className="btn btn-sm btn-link action" href={`https://twitter.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
                OPEN
              </a>
              <Clipboard className="btn btn-sm btn-link action" data-clipboard-text={identity.identity}>
                COPY
              </Clipboard>
            </div>
          </div>
        )
      case 'github':
        return (
          <div className="social-item">
            <a className="social github" href={`https://github.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
              <div className='icon'>
                <SVG src="icons/icon-github.svg" width={18} height={18} />
              </div>
              {identity.displayName}
            </a>
            <div className="actions">
              <a className="btn btn-sm btn-link action" href={`https://github.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
                OPEN
              </a>
              <Clipboard className="btn btn-sm btn-link action" data-clipboard-text={identity.identity}>
                COPY
              </Clipboard>
            </div>
          </div>
        )
      case 'keybase':
        return (
          <div className="social-item">
            <a className="social keybase" href={`https://keybase.io/${identity.displayName}`} target="_blank" rel="noopener noreferrer">
              <div className='icon'>
                <SVG src="icons/icon-keybase.svg" width={18} height={18} />
              </div>
              {identity.displayName}
            </a>
            <div className="actions">
              <a className="btn btn-sm btn-link action" href={`https://keybase.io/${identity.displayName}`} target="_blank" rel="noopener noreferrer">
                OPEN
              </a>
              <Clipboard className="btn btn-sm btn-link action" data-clipboard-text={identity.displayName}>
                COPY
              </Clipboard>
            </div>
          </div>
        )
      default:
        return null
    }
  }

}

export default ResultAccountItem;
