import Head from 'next/head'
import { useState } from 'react'
import Search from '../components/search'

export default function Home() {
  const [searchterm, setSearchterm] = useState('')
  const [searchResult, setSearchResult] = useState()
  const [searchFocus, setSearchFocus] = useState(false)

  const handleFocus = () => {
    setSearchFocus(true)
    console.log(searchFocus)
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
                <a href="/" className="web3bio-logo" title="Web3.bio">
                  <h1>WEB3<br/>BIO</h1>
                </a>
                <div className="web3bio-account">
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="web3bio-cover creamwhisper"></div>

        <div className={searchFocus?'web3bio-search focused':'web3bio-search'}>
          <div className="container grid-xs">
            <form className='web3bio-form' autoComplete="off" role="search">
              <label className='form-label' for="searchbox"><span>Web3 Identity Search</span></label>
              <input
                type="text"
                placeholder="Search Twitter, ENS or Ethereum address"
                className='form-input input-lg'
                id='searchbox'
                onFocus={handleFocus}
              />
              <input className="d-none" type="submit" value="Submit"></input>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}