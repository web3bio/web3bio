import { useQuery } from '@apollo/client'
import ResultItem from './ResultItem'
import { GET_PROFILES_TWITTER } from '../../utils/queries'

const SearchResultTwitter = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_TWITTER, {
    variables: { twitter: searchTerm },
  })
  console.log(data)
  let results = data?.identity.neighbor.filter( (ele, index) => index === data?.identity.neighbor.findIndex( elem => elem.uuid === ele.uuid))

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
            <figure class="avatar" data-initial={data?.identity.displayName.substring(0, 2)} ></figure>
            <div className='content'>
              <div className='h3 text-bold'>{data?.identity.displayName}</div>
                {data?.identity ? (
                    <div className='text-gray'><small>@{searchTerm}</small></div>
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

export default SearchResultTwitter;