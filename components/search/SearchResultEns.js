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

  let results = data?.nft
  let resultOwner = results?.owner
  let resultNeighbor = resultOwner.neighbor.filter((ele, index) => index === resultOwner.neighbor.findIndex(elem => elem.identity.uuid == ele.identity.uuid || results?.owner.uuid == ele.identity.uuid))
  console.log(results, resultNeighbor)

  return (
    results ? (
      <ResultAccount searchTerm={searchTerm} resultOwner={resultOwner} resultNeighbor={resultNeighbor} />
    ) : (
      <Empty />
    )
  )
}

export default SearchResultEns;