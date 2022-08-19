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
  let resultsOwner = results?.owner
  let resultsNeighbor = results?.owner.neighbor.filter( (ele, index) => index === results?.owner.neighbor.findIndex( elem => elem.uuid == ele.uuid || results?.owner.uuid == ele.uuid))
  console.log(resultsOwner, resultsNeighbor)

  return (
    results ? (
      <ResultAccount searchTerm={searchTerm} resultsOwner={resultsOwner} resultsNeighbor={resultsNeighbor} />
    ) : (
      <Empty />
    )
  )
}

export default SearchResultEns;