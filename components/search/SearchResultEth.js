import { useQuery } from '@apollo/client'
import ResultAccountItem from './ResultAccountItem'
import { GET_PROFILES_ETH } from '../../utils/queries'

const SearchResultEth = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ETH, {
    variables: { eth: searchTerm },
  })
  let results = data?.identity.neighbor.filter( (ele, index) => index === data?.identity.neighbor.findIndex( elem => elem.uuid === ele.uuid))
  console.log(results)

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
            <figure className="avatar" data-initial={data?.identity.displayName.substring(0, 2)} ></figure>
            <div className='content'>
              <div className='h4 text-bold mb-1'>{data?.identity.displayName}</div>
              {data?.identity ? (
                  <div className='text-gray'><small>{searchTerm}</small></div>
                ): (
                  <div className='text-gray'>No results</div>
              )}
            </div>
          </div>
            
          {results ? (
            <div className="search-result-body">
              {results.map((avatar) => (
                <ResultAccountItem identity={avatar} key={avatar.uuid} />
              ))}
            </div>
          ): null}
        </div>
      )}
    </>
  )
}

export default SearchResultEth;