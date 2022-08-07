import { useQuery } from '@apollo/client'
import ResultAccountItem from './ResultAccountItem'
import { GET_PROFILES_ENS } from '../../utils/queries'
import Clipboard from 'react-clipboard.js'
import SVG from 'react-inlinesvg'

const SearchResultEns = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  })
  let results = data?.nft.owner.neighbor.filter( (ele, index) => index === data?.nft.owner.neighbor.findIndex( elem => elem.uuid === ele.uuid))
  console.log(data)
  console.log(results)
  
  return (
    <>
      {loading && (
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      )}
      {!loading && (
        <div className="search-result">
          <div className="search-result-header">
            <figure className="avatar" data-initial={searchTerm.substring(0, 2)} ></figure>
            <div className='content'>
              <div className='content-title text-bold mb-1'>{searchTerm}</div>
              {data?.nft ? (
                <div className='content-subtitle text-gray'>
                  <small>{data?.nft.owner.identity}</small>
                  <Clipboard component="div" className="action" data-clipboard-text={data?.nft.owner.identity}>
                    <SVG src="icons/icon-copy.svg" width={20} height={20} />
                  </Clipboard>
                </div>
              ): (
                <div className='text-gray'>No results</div>
              )}
            </div>
          </div>
            
          {results ? (
            <div className="search-result-body">
              {results.map((avatar) => (
                <ResultAccountItem identity={avatar} key={avatar.uuid} />
              ))}
            </div>
          ): null}
        </div>
      )}
    </>
  )
}

export default SearchResultEns;