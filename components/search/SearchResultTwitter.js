import { useQuery } from '@apollo/client'
import ResultItem from './ResultItem'
import { GET_PROFILES_TWITTER } from '../../utils/queries'

const SearchResultTwitter = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_TWITTER, {
    variables: { twitter: searchTerm },
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
              <>
                <div className='h3 text-bold'>{data?.identity.displayName}</div>
                <div className='h6'>
                  <a href={`https://twitter.com/${data?.identity.identity}`} target="_blank" rel="noopener noreferrer">
                    twitter.com/{data?.identity.identity}
                  </a>
                </div>
              </>
            ): (
              <>
                <div className='h3 text-bold'>{searchTerm}</div>
                <div className='h6'>No results</div>
              </>
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

export default SearchResultTwitter;