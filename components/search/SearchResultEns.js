import { useQuery } from '@apollo/client'
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
          {data?.nft.owner.displayName}
          {data?.nft.owner.neighbor.map((avatar) => (
            <div key={avatar.uuid}>
              {avatar.platform} - {avatar.identity}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default SearchResultEns;