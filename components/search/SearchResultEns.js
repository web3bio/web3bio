import { useQuery } from '@apollo/client'
import ResultAccount from './ResultAccount'
import { Loading, Empty } from '../shared'
import { GET_PROFILES_ENS } from '../../utils/queries'

const SearchResultEns = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  })

  if (loading) return (<Loading />)
  if (error) return `Error! ${error}`

  const results = data?.nft.owner
  let resultOwner = {
    identity: {
      uuid: results?.uuid,
      platform: results?.platform,
      identity: results?.identity,
      displayName: results?.displayName,
      nft: results?.nft
    }
  }
  let resultNeighbor = [...results?.neighbor]
      resultNeighbor.unshift(resultOwner)
      resultNeighbor = resultNeighbor.filter((ele, index) => index === resultNeighbor.findIndex(elem => elem.identity.uuid == ele.identity.uuid))
  console.log(resultNeighbor)
  
  return (
    resultNeighbor ? (
      <ResultAccount searchTerm={searchTerm} resultNeighbor={resultNeighbor} />
    ) : (
      <Empty />
    )
  )
}

export default SearchResultEns;