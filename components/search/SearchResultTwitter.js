import { useQuery } from '@apollo/client'
import ResultAccount from './ResultAccount'
import { Loading, Empty } from '../shared'
import { GET_PROFILES_QUERY } from '../../utils/queries'

const SearchResultTwitter = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_QUERY, {
    variables: {
      platform: "twitter",
      identity: searchTerm
    },
  })

  if (loading) return (<Loading />)
  if (error) return `Error! ${error}`

  let resultOwner = data?.identity
  let resultNeighbor = resultOwner?.neighbor.filter((ele, index) => index === resultOwner?.neighbor.findIndex(elem => elem.identity.uuid == ele.identity.uuid || resultOwner.uuid == ele.identity.uuid))
  console.log(resultOwner, resultNeighbor)

  return (
    resultOwner ? (
      <ResultAccount searchTerm={searchTerm} resultOwner={resultOwner} resultNeighbor={resultNeighbor} />
    ) : (
      <Empty />
    )
  )
}

export default SearchResultTwitter;