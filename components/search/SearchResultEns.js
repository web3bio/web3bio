import { useQuery } from '@apollo/client'
import ResultAccountItem from './ResultAccountItem'
import { GET_PROFILES_ENS } from '../../utils/queries'
import Clipboard from 'react-clipboard.js'
import SVG from 'react-inlinesvg'

const SearchResultEns = ({searchTerm}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  })
  let results_owner = data?.nft.owner
  let results_neighbor = results_owner?.neighbor.filter( (ele, index) => index === results_owner?.neighbor.findIndex( elem => elem.uuid === ele.uuid))
  let results_num = results_neighbor?.length
  console.log(results_neighbor)
  
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
              {results_owner ? (
                <>
                  <div className='content-subtitle text-gray'>
                    <small>{results_owner.identity}</small>
                    <Clipboard component="div" className="action" data-clipboard-text={results_owner.identity}>
                      <SVG src="icons/icon-copy.svg" width={20} height={20} />
                    </Clipboard>
                  </div>
                  {results_owner.nft?.length > 0 && (
                    <div className="nfts">
                      {results_owner.nft.map((nft) => (
                        <>
                          {nft.category == 'ENS' ? (
                            <div className="label" key={nft.uuid}>
                              <SVG src="icons/icon-ens.svg" width={16} height={16} />
                              {nft.id}
                            </div>
                          ) : null }
                        </>
                      ))}
                    </div>
                  )}
                </>
              ): (
                <div className='text-gray'>No results</div>
              )}
            </div>
          </div>
            
          {results_num >= 1 ? (
            <div className="search-result-body">
              {results_neighbor.map((avatar) => (
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