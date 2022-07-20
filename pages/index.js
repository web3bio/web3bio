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

  const regexEns = /.*\.eth$/,
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
    setSearchTerm(e.target.searchbox.value)

    let searchType = handleSearchType(e.target.searchbox.value)
    setSearchType(searchType)
  }

  return (
    <div>
      <Head>
        <title>Web5.bio</title>
        <meta name="description" content="Web5.bio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='web3bio-container'>
        <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="columns">
              <div className="column col-12">
                <Link href="/">
                  <a className="web3bio-logo" title="Web3.bio">
                    <h1>WEB3<br/>BIO</h1>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-cover creamwhisper"></div>

        <div className={searchFocus?'web3bio-search focused':'web3bio-search'}>
          <div className='container grid-xs'>
            <form className='web3bio-form' onSubmit={handleSubmit} autoComplete='off' role='search'>
              <label className='form-label' htmlFor="searchbox"><span>Web3 Identity Search</span></label>
              <div className='form-input-group'>
                <input
                  type='text'
                  placeholder='Search Twitter, ENS or Ethereum address'
                  className='form-input input-lg'
                  id='searchbox'
                />
                <button type="submit" title="Submit" className="form-button btn btn-link">
                  <SVG src="icons/icon-search.svg" className="icon" />
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
      </main>
    </div>
  )
}