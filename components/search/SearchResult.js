import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PROFILES_ENS, GET_PROFILES_ETH, GET_PROFILES_TWITTER } from '../../utils/queries'

const SearchResult = ( {searchterm} ) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchterm },
  })
  console.log(data)

  return (
    <div className="searchresult">
      {loading && (
        <div className="loading"></div>
      )}
      {!loading && (
        <>
          {data.nft?.owner.displayName}
          {data.nft?.owner.neighbor.map((avatar) => (
            <div>
              {avatar.platform} - {avatar.identity}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default SearchResult;