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
          <a className="social ethereum" key={identity.uuid} href={`https://etherscan.io/address/${identity.identity}`} target="_blank" rel="noopener noreferrer">
            <SVG src="icons/icon-ethereum.svg" className="icon" />
            {identity.displayName}
          </a>
        )
      case 'twitter':
        return (
          <a className="social twitter" key={identity.uuid} href={`https://twitter.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
            <SVG src="icons/icon-twitter.svg" className="icon" />
            {identity.displayName}
          </a>
        )
      case 'github':
        return (
          <a className="social github" key={identity.uuid} href={`https://github.com/${identity.identity}`} target="_blank" rel="noopener noreferrer">
            <SVG src="icons/icon-github.svg" className="icon" />
            {identity.displayName}
          </a>
        )
      case 'keybase':
        return (
          <a className="social keybase" key={identity.uuid} href={`https://keybase.io/${identity.displayName}`} target="_blank" rel="noopener noreferrer">
            <SVG src="icons/icon-keybase.svg" className="icon" />
            {identity.displayName}
          </a>
        )
      default:
        return null
    }
  }

}

export default ResultItem;
