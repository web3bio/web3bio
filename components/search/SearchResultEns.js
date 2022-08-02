import { useQuery } from '@apollo/client'
import ResultItem from './ResultItem'
import { GET_PROFILES_ENS } from '../../utils/queries'

const SearchResultEns = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  })
  let results = data?.nft.owner.neighbor.filter( (ele, index) => index === data?.nft.owner.neighbor.findIndex( elem => elem.uuid === ele.uuid))
  console.log(data)
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
            <figure className="avatar" data-initial={searchTerm.substring(0, 2)} ></figure>
            <div className='content'>
              <div className='h3 text-bold mb-2'>{searchTerm}</div>
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

export default SearchResultEns;