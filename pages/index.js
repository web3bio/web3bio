import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import SVG from 'react-inlinesvg'
import SearchResultEns from '../components/search/SearchResultEns'
import SearchResultEth from '../components/search/SearchResultEth'
import SearchResultTwitter from '../components/search/SearchResultTwitter'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [searchType, setSearchType] = useState('')
  const router = useRouter()

  const regexEns = /.*\.eth|.xyz$/,
        regexEth = /^0x[a-fA-F0-9]{40}$/,
        regexTwitter = /(\w{1,15})\b/

  useEffect(() => {
    if(router.isReady) {
      if(router.query.s) {
        setSearchFocus(true)
        console.log(router.query.s)
  
        let searchkeyword = router.query.s.toLowerCase()
        setSearchTerm(searchkeyword)
    
        let searchType = handleSearchType(searchkeyword)
        setSearchType(searchType)
      } else {
        setSearchFocus(false)
        setSearchTerm('')
        setSearchType('')
      }
    };
    
  }, [router])
  
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
    e.preventDefault()
    router.push({
      query: { s: e.target.searchbox.value },
    })
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
              <Link href={{
                pathname: '/',
                query: {},
              }}>
                <a className="web3bio-logo" title="Web5.bio">
                  <h1 className="text-pride">WEB5<br/>BIO</h1>
                </a>
              </Link>
              <div className='form-label'>Web3 <span>Identity Search</span></div>
              <div className='form-input-group'>
                <input
                  type='text'
                  name='s'
                  placeholder='Search Twitter, ENS or Ethereum'
                  defaultValue={searchTerm}
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
                <div className="mt-4">
                  A <a href="https://web3.bio" target="_blank" rel="noopener noreferrer">Web3.bio</a> project crafted with <span className="text-pride">&hearts;</span> · Proudly built with <a href="https://next.id" target="_blank" rel="noopener noreferrer">Next.ID</a>
                </div>
                <div className="footer-feedback mt-4">
                  <a href="https://feedback.web5.bio/" className="btn btn btn-sm" target="_blank" rel="noopener noreferrer"><span className='mr-2'>👋</span> Feedback</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}