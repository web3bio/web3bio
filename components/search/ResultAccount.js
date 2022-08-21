import React, { Component } from 'react'
import ResultAccountItem from './ResultAccountItem'

class ResultAccount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { searchTerm, resultsOwner, resultsNeighbor } = this.props

    return (
      <div className="search-result">
        <div className="search-result-header">
          <div className="text-gray">
            Search results for <span className="text-underline">{searchTerm}</span>:
          </div>
        </div>
        <div className="search-result-body">
          <ResultAccountItem identity={resultsOwner} />
          {resultsNeighbor.length >= 1 ? (
            <>
              {resultsNeighbor.map((avatar) => (
                <ResultAccountItem identity={avatar} key={avatar.uuid} />
              ))}
            </>
          ): null}
        </div>
      </div>
    )  
  }
}

export default ResultAccount;
