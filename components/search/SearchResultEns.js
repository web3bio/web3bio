import { useQuery } from '@apollo/client'
import ResultItem from './ResultItem'
import { GET_PROFILES_ENS } from '../../utils/queries'

const SearchResultEns = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  })

  return (
    <div className="searchresult">
      {loading && (
        <div className="loading"></div>
      )}
      {!loading && (
        <>
          <div className="searchresult">
            <div className='h3 text-bold'>{searchTerm}</div>
            {data?.nft ? (
                <div className='h6'>{data?.nft.owner.displayName}</div>
              ): (
                <div className='h6'>No results</div>
            )}
          </div>
          {data?.nft ? (
            <div className="searchresult">
              {data?.nft.owner.neighbor.map((avatar) => (
                <ResultItem identity={avatar} key={avatar.uuid} />
              ))}
            </div>
          ): null}
        </>
      )}
    </div>
  )
}

export default SearchResultEns;