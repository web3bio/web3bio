import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import SVG from 'react-inlinesvg'
import SearchResult from '../components/search/SearchResult'

export default function Home() {
  const [searchterm, setSearchterm] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)

  const handleFocus = () => {
    setSearchFocus(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchFocus(true)
    setSearchterm(e.target.searchbox.value)
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
                <Link href="/" className="web3bio-logo" title="Web3.bio">
                  <h1>WEB3<br/>BIO</h1>
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
            {searchterm.length > 0 && (
              <SearchResult searchterm={searchterm} />
            )}

          </div>
        </div>
      </main>
    </div>
  )
}