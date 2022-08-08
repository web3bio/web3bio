import React, { Component } from 'react'
import ResultAccountItem from './ResultAccountItem'
import Clipboard from 'react-clipboard.js'
import SVG from 'react-inlinesvg'

class ResultAccount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { resultsOwner, resultsNeighbor } = this.props

    return (
      <div className="search-result">
        <div className="search-result-header">
          <figure className="avatar" data-initial={resultsOwner.displayName.substring(0, 2)} ></figure>
          <div className='content'>
            <div className='content-title text-bold mb-1'>{resultsOwner.displayName}</div>
            <div className='content-subtitle text-gray'>
              <small>{resultsOwner.identity}</small>
              <Clipboard component="div" className="action" data-clipboard-text={resultsOwner.identity}>
                <SVG src="icons/icon-copy.svg" width={20} height={20} />
              </Clipboard>
            </div>
            {resultsOwner.nft?.length > 0 && (
              <div className="nfts">
                {resultsOwner.nft.map((nft) => (
                  <>
                    {nft.category == 'ENS' ? (
                      <div className="label-ens" key={nft.uuid}>
                        <SVG src="icons/icon-ens.svg" width={14} height={14} />
                        <span>{nft.id}</span>
                      </div>
                    ) : null }
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
          
        {resultsNeighbor.length >= 1 ? (
          <div className="search-result-body">
            {resultsNeighbor.map((avatar) => (
              <ResultAccountItem identity={avatar} key={avatar.uuid} />
            ))}
          </div>
        ): null}
      </div>
    )
      
  }
}

export default ResultAccount;
