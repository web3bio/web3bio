import Head from 'next/head'
import Search from '../components/search'

export default function Home() {
  
  return (
    <div>
      <Head>
        <title>Web5.bio</title>
        <meta name="description" content="Web5.bio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='web3bio-container'>
        <div className="web3bio-cover creamwhisper"></div>
        <div className="web3bio-hero">
          <div className="container grid-sm">
            <Search />
          </div>
        </div>
      </main>
    </div>
  )
}