import { useQuery } from '@apollo/client'
import ResultAccount from './ResultAccount'
import { GET_PROFILES_ENS } from '../../utils/queries'

const SearchResultEns = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  })

  if (loading) return (
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  )
  if (error) return `Error! ${error}`

  let results = data?.nft
  let resultsOwner = results?.owner
  let resultsNeighbor = results?.owner.neighbor.filter( (ele, index) => index === results?.owner.neighbor.findIndex( elem => elem.uuid == ele.uuid || results?.owner.uuid == ele.uuid))
  console.log(resultsOwner, resultsNeighbor)

  return (
    results ? (
      <ResultAccount searchTerm={searchTerm} resultsOwner={resultsOwner} resultsNeighbor={resultsNeighbor} />
    ) : (
      <div className="empty">
        <div className="empty-icon h1">🙀</div>
        <p className="empty-title h4">No results found</p>
        <p className="empty-subtitle">Please try different identity keyword.</p>
      </div>
    )
  )
}

export default SearchResultEns;