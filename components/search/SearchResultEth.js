import { useQuery } from '@apollo/client'
import ResultItem from './ResultItem'
import { GET_PROFILES_ETH } from '../../utils/queries'

const SearchResultEth = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ETH, {
    variables: { eth: searchTerm },
  })
  console.log(data)

  return (
    <div className="searchresult">
      {loading && (
        <div className="loading"></div>
      )}
      {!loading && (
        <>
          <div className="searchresult">
          {data?.identity ? (
            <div className='h3 text-bold'>{data?.identity.displayName}</div>
          ): (
            <div className='h3 text-bold'>{searchTerm}</div>
          )}
            
          </div>
          {data?.identity ? (
            <div className="searchresult">
              {data?.identity.neighbor.map((avatar) => (
                <ResultItem identity={avatar} key={avatar.uuid} />
              ))}
            </div>
          ): null}
        </>
      )}
    </div>
  )
}

export default SearchResultEth;