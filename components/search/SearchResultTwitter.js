import { useQuery } from '@apollo/client'
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
          {data?.identity.displayName}
          {data?.identity.neighbor.map((avatar) => (
            <div key={avatar.uuid}>
              {avatar.platform} - {avatar.identity}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default SearchResultTwitter;