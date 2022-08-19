import { useQuery } from '@apollo/client'
import ResultAccount from './ResultAccount'
import { Loading, Empty } from '../shared'
import { GET_PROFILES_TWITTER } from '../../utils/queries'

const SearchResultTwitter = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_TWITTER, {
    variables: { twitter: searchTerm },
  })

  if (loading) return (<Loading />)
  if (error) return `Error! ${error}`

  let resultsOwner = data?.identity
  let resultsNeighbor = resultsOwner?.neighbor.filter((ele, index) => index === resultsOwner?.neighbor.findIndex( elem => elem.uuid == ele.uuid || resultsOwner.uuid == ele.uuid))
  console.log(resultsOwner, resultsNeighbor)

  return (
    resultsOwner ? (
      <ResultAccount searchTerm={searchTerm} resultsOwner={resultsOwner} resultsNeighbor={resultsNeighbor} />
    ) : (
      <Empty />
    )
  )
}

export default SearchResultTwitter;