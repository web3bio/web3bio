import React, { Component } from 'react'
import Clipboard from 'react-clipboard.js'
import SVG from 'react-inlinesvg'

class ResultItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { identity } = this.props

    switch (identity.platform) {
      case 'ethereum':
        return (
          <div className="social-item">
            <a className="social ethereum" href={`https://etherscan.io/address/${identity.identity}`} target="_blank" rel="noopener noreferrer">
              <SVG src="icons/icon-ethereum.svg" className="icon" />
              {identity.displayName ? identity.displayName:identity.identity}
            </a>
            {identity.nft.length > 0 ? (
              <div className="search-result-body">
                {identity.nft.map((nft) => (
                  <span className="label mr-1 mb-1" key={nft.uuid}>{nft.id}</span>
                ))}
              </div>
            ): null}
          </div>
        )
      case 'twitter':
        return (
          <div className="social-item">
            <a className="social twitter" href={`https://twitter.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
              <SVG src="icons/icon-twitter.svg" className="icon" />
              {identity.displayName}
            </a>
          </div>
        )
      case 'github':
        return (
          <div className="social-item">
            <a className="social github" href={`https://github.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
              <SVG src="icons/icon-github.svg" className="icon" />
              {identity.displayName}
            </a>
          </div>
        )
      case 'keybase':
        return (
          <div className="social-item">
            <a className="social keybase" href={`https://keybase.io/${identity.displayName}`} target="_blank" rel="noopener noreferrer">
              <SVG src="icons/icon-keybase.svg" className="icon" />
              {identity.displayName}
            </a>
          </div>
          
        )
      default:
        return null
    }
  }

}

export default ResultItem;
