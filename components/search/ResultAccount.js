import React, { Component } from 'react'
import ResultAccountItem from './ResultAccountItem'

class ResultAccount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { searchTerm, resultOwner, resultNeighbor } = this.props

    return (
      <div className="search-result">
        <div className="search-result-header">
          <div className="text-gray">
            Search results for <span className="text-underline">{searchTerm}</span>:
          </div>
        </div>
        <div className="search-result-body">
          <ResultAccountItem identity={resultOwner} />
          {resultNeighbor.length >= 1 ? (
            <>
              {resultNeighbor.map((avatar) => (
                <ResultAccountItem identity={avatar.identity} sources={avatar.sources} key={avatar.identity.uuid} />
              ))}
            </>
          ): null}
        </div>
      </div>
    )  
  }
}

export default ResultAccount;
