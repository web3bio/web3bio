import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import SVG from 'react-inlinesvg'
import SearchResultEns from '../components/search/SearchResultEns'
import SearchResultEth from '../components/search/SearchResultEth'
import SearchResultTwitter from '../components/search/SearchResultTwitter'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [searchType, setSearchType] = useState('')

  const regexEns = /.*\.eth|.xyz$/,
        regexEth = /^0x[a-fA-F0-9]{40}$/,
        regexTwitter = /(\w{1,15})\b/
  
  const handleSearchType = (term) => {
    switch (true) {
      case regexEns.test(term):
        console.log("ENS")
        return "ENS"
      case regexEth.test(term):
        console.log("ETH")
        return "ETH"
      case regexTwitter.test(term):
        console.log("TWITTER")
        return "TWITTER"
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchFocus(true)
    let searchkeyword = e.target.searchbox.value
    setSearchTerm(searchkeyword.toLowerCase())

    let searchType = handleSearchType(searchkeyword.toLowerCase())
    setSearchType(searchType)
  }

  return (
    <div>
      <Head>
        {searchTerm ? (<title>{searchTerm} - Web5.bio</title>):(<title>Web5.bio</title>)}
        <meta name="description" content="Web3 Identity Search" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <main className='web3bio-container'>
        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-cover flare"></div>

        <div className={searchFocus?'web3bio-search focused':'web3bio-search'}>
          <div className='container grid-xs'>
            <form className='search-form' onSubmit={handleSubmit} autoComplete='off' role='search'>
              <Link href="/">
                <a className="web3bio-logo" title="Web5.bio">
                  <h1 className="text-pride">WEB5<br/>BIO</h1>
                </a>
              </Link>
              <div className='form-label'>Web3 <span>Identity Search</span></div>
              <div className='form-input-group'>
                <input
                  type='text'
                  placeholder='Search Twitter, ENS or Ethereum'
                  className='form-input input-lg'
                  autoCorrect="off"
                  autoFocus
                  spellCheck="false"
                  id='searchbox'
                />
                <button type="submit" title="Submit" className="form-button btn">
                  <SVG src="icons/icon-search.svg" width={24} height={24} className="icon" />
                </button>
              </div>
            </form>
            {(() => {
              switch (searchType) {
                case 'ENS':
                  return <SearchResultEns searchTerm={searchTerm} />
                case 'ETH':
                  return <SearchResultEth searchTerm={searchTerm} />
                case 'TWITTER':
                  return <SearchResultTwitter searchTerm={searchTerm} />
                default:
                  return null
              }
            })()}
          </div>
        </div>
        <div className="web3bio-footer">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <div className="mt-4 mb-2">A <a href="https://web3.bio" target="_blank" rel="noopener noreferrer">Web3.bio</a> project crafted with <span className="text-pride">&hearts;</span> · Proudly Built with <a href="https://next.id" target="_blank" rel="noopener noreferrer">Next.ID</a></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}