import { useQuery } from '@apollo/client'
import ResultAccount from './ResultAccount'
import { GET_PROFILES_TWITTER } from '../../utils/queries'

const SearchResultTwitter = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_TWITTER, {
    variables: { twitter: searchTerm },
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

export default SearchResultTwitter;