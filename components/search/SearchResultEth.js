import { useQuery } from '@apollo/client'
import ResultAccount from './ResultAccount'
import { GET_PROFILES_ETH } from '../../utils/queries'

const SearchResultEth = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ETH, {
    variables: { eth: searchTerm },
  })

  if (loading) return (
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  )
  if (error) return `Error! ${error}`

  let resultsOwner = data?.identity
  let resultsNeighbor = resultsOwner?.neighbor.filter( (ele, index) => index === resultsOwner?.neighbor.findIndex( elem => elem.uuid == ele.uuid || resultsOwner.uuid == ele.uuid))
  console.log(resultsOwner, resultsNeighbor)

  return (
    resultsOwner ? (
      <ResultAccount resultsOwner={resultsOwner} resultsNeighbor={resultsNeighbor} />
    ) : (
      <div className="empty">
        <div className="empty-icon h1">🙀</div>
        <p className="empty-title h4">No results found</p>
        <p className="empty-subtitle">Please try different identity keyword.</p>
      </div>
    )
  )
}

export default SearchResultEth;