import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PROFILES_ENS, GET_PROFILES_ETH, GET_PROFILES_TWITTER } from '../../utils/queries'

const SearchResult = ( {searchterm} ) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchterm },
  })
  console.log(data)

  return (
    <>
      {loading && (
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      )}
      {!loading && (
        <div className="search-result">
          <div className="search-result-header">
            <figure className="avatar" data-initial={searchTerm.substring(0, 2)} ></figure>
            <div className='content'>
              <div className='h3 text-bold'>{searchTerm}</div>
                {data?.nft ? (
                    <div className='text-gray'><small>{data?.nft.owner.identity}</small></div>
                  ): (
                    <div className='text-gray'>No results</div>
                )}
              </div>
            </div>
            
          {results ? (
            <div className="search-result-body">
              {results.map((avatar) => (
                <ResultItem identity={avatar} key={avatar.uuid} />
              ))}
            </div>
          ): null}
        </div>
      )}
    </>
  )
}

export default SearchResult;